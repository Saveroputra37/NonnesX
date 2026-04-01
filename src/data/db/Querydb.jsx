import {
  databases,
  DATABASE_ID,
  storage,
  COLLECTION_ID_POST,
} from "../appwriteconfig";
import { ID, Query } from "appwrite";
import { useEffect, useState } from "react";
import { subscribeToPosts } from "../service/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const COLLECTION_ID = "posts";
const BUCKET_ID = "69b65237000c0c300c8b";

export const useGetDocumentById = (documentId) => {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID_POST,
        documentId,
      );
      return response;
    },
    enabled: !!documentId, // Hanya jalan jika documentId ada
  });
};

export const useGetDocuments = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialPosts = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_POST,
        [Query.orderDesc("$createdAt"), Query.limit(20)],
      );
      setPosts(response.documents);
    } catch (error) {
      console.error("Gagal mengambil posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialPosts();

    // 1. Pastikan argumen di-destructure: { type, payload }
    const unsubscribe = subscribeToPosts(({ type, payload }) => {
      setPosts((prev) => {
        // 2. Tangani sesuai tipe event dari Appwrite
        if (type === "create") {
          // Cek agar tidak duplikat (penting jika user yang sama yang membuat post)
          if (prev.some((p) => p.$id === payload.$id)) return prev;

          // MASUKKAN PAYLOAD-NYA SAJA (Data dokumen), bukan objek {type, payload}
          return [payload, ...prev];
        }

        if (type === "update") {
          return prev.map((p) => (p.$id === payload.$id ? payload : p));
        }

        if (type === "delete") {
          // Jika dihapus oleh user lain, otomatis hilang di layar user ini
          return prev.filter((p) => p.$id !== payload.$id);
        }

        return prev;
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { posts, loading, refetch: fetchInitialPosts };
};
export const createNewPost = async (content, file, user) => {
  try {
    let imageUrl = null;
    let fileimageid = null;
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
      fileimageid = uploadResponse.$id;
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
      image_post: fileimageid || "minus",
      url_image_post: imageUrl || "minus", // Pastikan tidak null agar tidak error di Appwrite
    };

    // 3. Simpan ke Database
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      postData,
    );
    console.log(response);

    return response;
  } catch (error) {
    console.error("Error in createNewPost service:", error);
    throw error;
  }
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, fileId }) => {
      // 1. Hapus File di Bucket (jika fileId ada)
      if (fileId) {
        await storage.deleteFile(BUCKET_ID, fileId);
      }

      // 2. Hapus Dokumen di Database
      return await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        documentId,
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      console.log("File dan Dokumen berhasil dihapus!");
    },

    onError: (error) => {
      console.error("Gagal menghapus:", error.message);
    },
  });
};
export const fetchVideos = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, "reelspost", [
      Query.orderDesc("$createdAt"),
    ]);

    // Base URL Appwrite Anda
    const endpoint = "https://sgp.cloud.appwrite.io/v1";
    const project = "69b4d7040031272d9173"; // ID Project Anda

    return response.documents.map((doc) => {
      const thumbId = doc.thumbnail_rels;
      const videoId = doc.url_rels;

      // CARA MANUAL (Sangat Direkomendasikan jika SDK rewel)
      // Format: [endpoint]/storage/buckets/[bucketId]/files/[fileId]/view?project=[projectId]
      const thumbUrl =
        thumbId && thumbId !== "minus"
          ? `${endpoint}/storage/buckets/${BUCKET_ID}/files/${thumbId}/view?project=${project}`
          : "";

      const videoUrl =
        videoId && videoId !== "minus"
          ? `${endpoint}/storage/buckets/${BUCKET_ID}/files/${videoId}/view?project=${project}`
          : "";

      return {
        id: doc.$id,
        title: doc.title_rels || "Untitled Video",
        thumbnail: thumbUrl,
        url: videoUrl,
        views: doc.views_rels || "0 views",
        creator: doc.creator_rels || "Anonymous",
        createdAt: doc.$createdAt,
      };
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

export const createNewVideoPost = async (data) => {
  // Destructure data termasuk 'thumbnail' dari modal
  const { content, file, thumbnail, user } = data;

  try {
    let videoFileId = "minus";
    let thumbFileId = "minus";

    // 1. Upload Video Utama
    if (file) {
      const uploadedVideo = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file,
      );
      videoFileId = uploadedVideo.$id;
    }

    // 2. Upload Thumbnail Custom (Jika user memilih gambar cover)
    if (thumbnail) {
      const uploadedThumb = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        thumbnail,
      );
      thumbFileId = uploadedThumb.$id;
    }

    // 3. Simpan Metadata ke Collection 'reelspost'
    const response = await databases.createDocument(
      DATABASE_ID,
      "reelspost",
      ID.unique(),
      {
        title_rels: content || "",
        url_rels: videoFileId, // Menyimpan ID File Video
        thumbnail_rels: thumbFileId, // Menyimpan ID File Thumbnail
        views_rels: 0,
        creator_rels: user.username || "Anonymous",
        user_rels: user.id || "unknown",
        user_email_rels: user.email || "no-email",
      },
    );

    console.log("Reel successfully created:", response.$id);
    return response;
  } catch (error) {
    console.error("Error in createNewVideoPost:", error);
    // Lempar error agar ditangkap oleh TanStack Mutation (isError)
    throw new Error(error.message || "Failed to upload reel");
  }
};

export const deleteVideoPost = async (videoId) => {
  try {
    await databases.deleteDocument(DATABASE_ID, "reelspost", videoId);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
