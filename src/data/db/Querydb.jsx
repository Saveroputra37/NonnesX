import { databases, DATABASE_ID, storage } from "../appwriteconfig";
import { ID, Query } from "appwrite";
import { useEffect, useState } from "react";
import { subscribeToPosts } from "../service/service";
const COLLECTION_ID = "posts";
const BUCKET_ID = "69b65237000c0c300c8b";
import CardPost from "../../assets/lib/Cardpost";
export const useGetDocuments = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialPosts = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(20)],
      );
      setPosts(response.documents);
    } catch (error) {
      console.error("Gagal mengambil posts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialPosts();

    // Start Subscription
    const unsubscribe = subscribeToPosts((payload) => {
      setPosts((prev) => {
        // Prevent duplicates if the creator also receives the event
        if (prev.some((p) => p.$id === payload.$id)) return prev;
        return [payload, ...prev];
      });
    });

    // Cleanup: This is vital in React Strict Mode/Development
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return { posts, loading, refetch: fetchInitialPosts };
};

export const createNewPost = async (content, file, user) => {
  try {
    let imageUrl = null;

    // 1. Logika Upload Gambar
    if (file) {
      const uploadResponse = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file,
      );

      // Kadang getFileView mengembalikan objek URL, gunakan .href atau .toString()
      const result = storage.getFileView(BUCKET_ID, uploadResponse.$id);

      // SOLUSI: Pastikan diconvert ke string
      imageUrl = result.href ? result.href : result.toString();

      console.log("Generated Image URL:", imageUrl); // Cek di console log
    }

    // 2. Persiapkan Data Dokumen
    const postData = {
      id_user: user?.id || "unknown",
      email_user: user?.primaryEmailAddress?.emailAddress || "no-email",
      name_user: user?.username || user?.firstName || "Anonymous",
      avatar_user: user?.imageUrl || "",
      content_post: content,
      isverified_user: false,
      image_post: imageUrl || "minus",
      url_image_post: imageUrl || "minus", // Pastikan tidak null agar tidak error di Appwrite
    };

    // 3. Simpan ke Database
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      postData,
    );

    return response;
  } catch (error) {
    console.error("Error in createNewPost service:", error);
    throw error;
  }
};
