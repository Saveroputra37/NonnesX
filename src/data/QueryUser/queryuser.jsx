import { useQuery } from "@tanstack/react-query";
import { databases, DATABASE_ID, COLLECTION_ID_USERS } from "../appwriteconfig";

const fetchClerkUsers = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_USERS,
    );

    // Log before returning so you can actually see it in the console

    return response.documents;
  } catch (error) {
    console.error("Appwrite fetch error:", error);
    // Throwing allows React Query to catch the error
    throw error;
  }
};

// Custom Hook: Hanya mengelola data
export function useUserList() {
  return useQuery({
    queryKey: ["clerkUsers"],
    queryFn: fetchClerkUsers,
  });
}
