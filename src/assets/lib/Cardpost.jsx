import React from "react";
import {
  MessageCircle,
  Repeat2,
  Heart,
  BarChart3,
  Share,
  MoreHorizontal,
  BadgeCheck, // Menambahkan icon verifikasi
} from "lucide-react";
import { useGetDocuments } from "../../data/db/Querydb";

const TweetCard = () => {
  const { data: posts, isLoading, isError } = useGetDocuments();

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Memuat tweet...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">
        Gagal mengambil data dari Appwrite.
      </div>
    );
  }

  // Sesuai struktur Appwrite, ambil array dari property documents
  const tweetList = posts || [];

  return (
    <>
      {tweetList.map((tweet) => (
        <div
          key={tweet.$id}
          className="rounded-lg max-w-[600px] w-full bg-black border-b border-gray-800 p-4 transition-colors cursor-pointer font-sans text-white my-2 "
        >
          <div className="flex gap-3 ">
            {/* Avatar User */}

            {/* Content Section */}
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1 gap-x-3 flex-wrap">
                  <div className="shrink-0">
                    <img
                      src={
                        tweet.avatar_user ||
                        "https://unavatar.io/twitter/placeholder"
                      }
                      alt="Avatar"
                      className="w-10 h-10 rounded-full bg-gray-700 object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-[15px] hover:underline flex items-center gap-2">
                      {tweet.name_user}
                      {/* Badge Verifikasi jika isverified_user true */}
                      {tweet.isverified_user && (
                        <BadgeCheck
                          size={16}
                          className="text-[#1d9bf0] fill-[#1d9bf0] "
                        />
                      )}
                    </span>
                    <span className="text-[#71767b] text-[15px]">
                      {/* Menggunakan email sebagai handle karena di data Anda tidak ada handle khusus */}
                      @{tweet.email_user.split("@")[0].toLowerCase()}
                    </span>
                    <span className="text-[#71767b] text-[15px]">·</span>
                    <span className="text-[#71767b] text-[15px] hover:underline">
                      {new Date(tweet.$createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button className="text-[#71767b] hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-1.5 rounded-full">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Teks Postingan */}
              <div className="text-[15px] text-[#e7e9ea]  whitespace-pre-wrap leading-normal mt-5">
                {tweet.content_post}
              </div>

              {/* Gambar Postingan (Cek jika image_post ada dan bukan string kosong) */}
              {tweet.image_post && tweet.image_post !== "minus" && (
                <div className="my-5 rounded-2xl border border-gray-800 overflow-hidden">
                  <img
                    src={tweet.image_post}
                    alt="Post content"
                    className="w-full h-auto object-cover max-h-[270px]"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}

              {/* Action Buttons dengan Nama Property yang Sesuai */}
              <div className="flex  justify-between mt-3  text-[#71767b] -ml-2 w-full">
                <ActionIcon
                  Icon={MessageCircle}
                  count={tweet.replies}
                  hoverColor="hover:text-[#1d9bf0]"
                  hoverBg="group-hover:bg-[#1d9bf0]/10"
                />
                <ActionIcon
                  Icon={Repeat2}
                  count={tweet.repost}
                  hoverColor="hover:text-[#00ba7c]"
                  hoverBg="group-hover:bg-[#00ba7c]/10"
                />
                <ActionIcon
                  Icon={Heart}
                  count={tweet.likes}
                  hoverColor="hover:text-[#f91880]"
                  hoverBg="group-hover:bg-[#f91880]/10"
                />
                <ActionIcon
                  Icon={BarChart3}
                  count={tweet.views}
                  hoverColor="hover:text-[#1d9bf0]"
                  hoverBg="group-hover:bg-[#1d9bf0]/10"
                />
                <div className="p-2 hover:bg-[#1d9bf0]/10 rounded-full hover:text-[#1d9bf0]">
                  <Share size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const ActionIcon = ({ Icon, count, hoverColor, hoverBg }) => (
  <button
    className={`flex items-center justify-between gap-1 group transition-colors w-full ${hoverColor}`}
  >
    <div className={`p-2 ${hoverBg} rounded-full transition-colors`}>
      <Icon size={18} />
    </div>
    <span className="text-[13px]">{count || 0}</span>
  </button>
);

export default TweetCard;
