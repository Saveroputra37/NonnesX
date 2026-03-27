import { Client, Databases, Account } from "appwrite";

// Pastikan variabel env terbaca
if (
  !import.meta.env.VITE_APPWRITE_ENDPOINT || 
  !import.meta.env.VITE_APPWRITE_PROJECT_ID
) {
  console.error("Appwrite environment variables are missing!");
}


const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
export const account = new Account(client); // Tambahkan ini jika butuh login/register via Appwrite juga

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTION_ID_USERS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_USERS;

export default client; // Collection tempat menyimpan user Clerk
