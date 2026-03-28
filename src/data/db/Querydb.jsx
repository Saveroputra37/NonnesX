import { useQuery } from "@tanstack/react-query";
import { databases, DATABASE_ID } from "../appwriteconfig";
import { Query } from "appwrite";

const COLLECTION_ID = "posts";

export const useGetDocuments = () => {
  return useQuery({
    queryKey: ["documents"], // Key unik untuk caching
    queryFn: async () => {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.orderDesc("$createdAt"), // Contoh: Urutkan dari yang terbaru
          Query.limit(10), // Contoh: Ambil 10 data saja
        ],
      );
      return response.documents; // Mengembalikan array dokumen saja
    },
  });
};
