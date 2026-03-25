/* global process */

import express from "express";
import bodyParser from "body-parser";
import { Webhook } from "svix";
import { Client, Databases } from "node-appwrite";
import "dotenv/config";
const app = express();

// Konfigurasi Appwrite
const client = new Client()
  .setEndpoint(
    process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1",
  ) // Ganti jika self-hosted
  .setProject(process.env.APPWRITE_PROJECT_ID || "69b4d7040031272d9173")
  .setKey(
    process.env.APPWRITE_API_KEY ||
      "standard_b2d4f5fa14b98026fb4d26b831227bc88d3a08d110e42032eff4e786864f5212246760e95a5cf2da47e09748e9f4806be69a7f7b0b4f5db5396b7f4f4cc57721c9d3828fbcee7fe17837e47fdbb723613c66106942d3b215654b51a12b694650ed4767bd4b727fe0a623611f83731631ecbce4b1aea353ffdec01a53a197ea18",
  ); // API Key dengan scope 'documents.write'

const databases = new Databases(client);
const DATABASE_ID = process.env.DATABASE_ID || "69b4dc180026208c5959"; // Sesuaikan ID Database Anda
const COLLECTION_ID = process.env.COLLECTION_ID || "users"; // Sesuaikan ID Koleksi Anda

app.get("/", (req, res) => {
  res.send("anda sudah kembali");
});


async function handleUserEvent(evt) {
  const { id, first_name, last_name, email_addresses, image_url } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const userData = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      imageUrl: image_url,
      updatedAt: new Date().toISOString(),
    };

    try {
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, userData);
      console.log(`User ${id} updated in Appwrite`);
    } catch (e) {
      if (e.code === 404) {
        await databases.createDocument(DATABASE_ID, COLLECTION_ID, id, {
          ...userData,
          createdAt: new Date().toISOString(),
        });
        console.log(`User ${id} created in Appwrite`);
      } else {
        throw e;
      }
    }
  } else if (eventType === "user.deleted") {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    console.log(`User ${id} deleted from Appwrite`);
  } else {
    console.log(`Unhandled event type: ${eventType}`);
  }
}

app.post(
  "/api/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!SIGNING_SECRET) {
      return res.status(500).json({ error: "Missing webhook secret" });
    }

    const wh = new Webhook(SIGNING_SECRET);
    const headers = req.headers;
    const payload = req.body;

    try {
      // Verifikasi signature dari Clerk
      const evt = wh.verify(payload, {
        "svix-id": headers["svix-id"],
        "svix-timestamp": headers["svix-timestamp"],
        "svix-signature": headers["svix-signature"],
      });

  console.log("------- DATA MASUK DARI CLERK -------");
  console.log(evt);
  console.log("-------------------------------------");


      // Jalankan fungsi handle event
      await handleUserEvent(evt);

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Webhook verification failed:", err.message);
      return res.status(400).json({ error: "Invalid signature" });
    }
  },
);

app.use(express.json());


app.listen(3000, () => console.log("Webhook server running on port 3000"));
