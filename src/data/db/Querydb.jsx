import { useQuery } from "@tanstack/react-query";
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
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(20)],
      );
      console.log("Data Appwrite Berhasil:", response.documents);
      setPosts(response.documents);
    } catch (error) {
      console.error("Gagal mengambil posts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialPosts();

    const unsubscribe = subscribeToPosts((newPost) => {
      setPosts((prevPosts) => {
        // Cek agar tidak ada data ganda jika koneksi lambat
        if (prevPosts.find((p) => p.$id === newPost.$id)) return prevPosts;
        return [newPost, ...prevPosts];
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Kembalikan objek data, bukan JSX
  return { posts, loading };
};

export const createNewPost = async (content, file, user) => {
  try {
    let imageId = null;
    let imageUrl = null; // Tambahkan variable untuk menampung URL

    // 1. Logika Upload Gambar (Jika ada)
    if (file) {
      const uploadResponse = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file,
      );
      imageId = uploadResponse.$id;

      // GENERATE URL: Ambil URL publik dari file yang baru diupload
      const result = storage.getFileView(BUCKET_ID, imageId);
      imageUrl = result.href;
    }

    // 2. Persiapkan Data Dokumen
    const postData = {
      id_user: user?.id,
      email_user: user?.primaryEmailAddress?.emailAddress,
      name_user: user?.username || user?.firstName || "Anonymous",
      avatar_user: user?.imageUrl,
      content_post: content,
      isverified_user: false,
      image_post: imageId, // Simpan ID (untuk keperluan manajemen file)
      url_image_post: imageUrl, // Simpan URL Langsung (agar feed lebih cepat render)
    };

    // 3. Simpan ke Database
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      postData,
    );

    // Kita return response asli + imageUrl agar UI bisa langsung update jika perlu
    return { ...response, fullImageUrl: imageUrl };
  } catch (error) {
    console.error("Error in createNewPost service:", error);
    throw error;
  }
};