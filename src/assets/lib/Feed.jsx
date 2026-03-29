import React from "react";
import { useGetDocuments } from "../../data/db/Querydb"; // Sesuaikan path folder hook Anda
import TweetCard from "./Cardpost";

const Feed = () => {
  const { posts, loading: postsLoading } = useGetDocuments();

  // Debugging: Cek di console log apakah user muncul setelah beberapa saat
  // WAJIB: Jangan render apapun sampai Clerk selesai loading (isLoaded === true)
  if (postsLoading) {
    return (
      <div className="flex justify-center items-center p-10 min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1d9bf0]"></div>
      </div>
    );
  }

  return (
    <div className="h-fit flex justify-center">
      <div className="w-full xl:min-w-[600px] min-w-[440px]">
        <div className="flex flex-col">
          {posts.map((post) => (
            <TweetCard
              key={post.$id}
              tweet={post}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;