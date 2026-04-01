import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  MessageCircle,
  Repeat2,
  Heart,
  BarChart3,
  Share,
  MoreHorizontal,
  BadgeCheck,
  Trash2,
} from "lucide-react";
import { useDeleteDocument } from "../../data/db/Querydb";
import { Link, useNavigate } from "react-router-dom";

const TweetCard = ({ tweet }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const { mutate, isPending } = useDeleteDocument();
  const navigate = useNavigate();

  if (!tweet || !tweet.$id || !tweet.content_post) return null;

  const isOwner = isLoaded && user && user.id === tweet.id_user;
  const userHandle = tweet.email_user?.split("@")[0].toLowerCase() || "user";

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (e) {
      console.log(e);
      return "";
    }
  };

  const handleCardClick = () => {
    navigate(`/detail/${tweet.$id}`);
  };

  const handleDelete = (e) => {
    // Tambahkan pengecekan jika e ada, agar tidak error jika dipanggil tanpa event
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (confirm("Hapus postingan ini?")) {
      // Cek apakah ada file yang valid (bukan null dan bukan "minus")
      const hasFile = tweet.image_post && tweet.image_post !== "minus";

      mutate({
        documentId: tweet.$id,
        fileId: hasFile ? tweet.image_post : null,
      });
    }
  };

  return (
    <div onClick={handleCardClick}>
      <div className="w-full xl:min-w-[650px] min-w-[480px] xl:max-w-[650px] max-w-[480px] bg-black border border-[#2f3336] m-2 rounded-xl p-3 px-4 shadow-[0_0_10px_rgba(255,255,255,0.03)] hover:shadow-[0_0_20px_rgba(255,255,255,0.07)] hover:bg-white/5 transition-all duration-300 cursor-pointer font-sans">
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex gap-x-3 items-center overflow-hidden whitespace-nowrap text-[15px]">
                <div className="shrink-0">
                  <img
                    src={
                      tweet.avatar_user ||
                      "https://unavatar.io/twitter/placeholder"
                    }
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover border border-[#2f3336]"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-[#e7e9ea] hover:underline truncate">
                      {tweet.name_user}
                    </p>
                    {tweet.isverified_user && (
                      <BadgeCheck
                        size={16}
                        className="text-[#1d9bf0] fill-[#1d9bf0] shrink-0"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-[#71767b] truncate">@{userHandle}</p>
                    <p className="text-[#71767b]">·</p>
                    <p className="text-[#71767b] hover:underline shrink-0 text-sm">
                      {formatDate(tweet.$createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="text-[#71767b] active:bg-[#1d9bf0] hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-2 rounded-full transition-all"
                >
                  <MoreHorizontal size={18} />
                </button>

                {isMenuOpen && (
                  <>
                    {/* Overlay transparan untuk menutup menu saat klik di luar */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={(e) => {
                        e.preventDefault(); // Mencegah Link terpicu
                        e.stopPropagation(); // Mencegah bubbling ke Link
                        setIsMenuOpen(false);
                      }}
                    ></div>

                    <div
                      className="absolute top-5 right-0 mt-2 w-40 bg-[#0f172a] border border-[#2f3336] shadow-[0_8px_30px_rgb(255,255,255,0.1)] z-20 overflow-hidden rounded-xl"
                      onClick={(e) => {
                        e.preventDefault(); // Mencegah klik di area box menu memicu Link
                        e.stopPropagation();
                      }}
                    >
                      <div className="flex flex-col py-2 px-2">
                        {isOwner ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault(); // SANGAT PENTING: Mencegah navigasi
                              e.stopPropagation(); // SANGAT PENTING: Mencegah bubbling
                              handleDelete(e);
                              setIsMenuOpen(false);
                            }}
                            disabled={isPending}
                            className="flex items-center gap-3 px-3 py-2 text-[#f4212e] rounded-lg hover:text-white hover:bg-red-700 transition-colors font-bold text-[12px] w-full text-left"
                          >
                            <Trash2 size={18} />
                            <span>
                              {isPending ? "Deleting..." : "Delete Post"}
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-[#e7e9ea] hover:bg-white/[0.03] transition-colors text-[15px] w-full text-left"
                          >
                            <span className="opacity-50">Not interested</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="text-[15px] text-[#e7e9ea] leading-[1.4] whitespace-pre-wrap mt-3 mb-3">
              {tweet.content_post}
            </div>

            {tweet.url_image_post && tweet.url_image_post !== "minus" && (
              <div className="mb-3 bg-[#2f333652] overflow-hidden rounded-xl">
                <img
                  src={tweet.url_image_post}
                  alt="post content"
                  className="w-full h-auto max-h-[270px] object-contain block"
                  loading="lazy"
                />
              </div>
            )}

            {/* Interaction Bar - Sekarang memanggil InteractionButton yang sudah didefinisikan di bawah */}
            <div className="flex border-t border-gray-400/10 w-full justify-between -ml-2 text-[#71767b] pt-2">
              <InteractionButton
                Icon={MessageCircle}
                count={tweet.replies}
                hoverColor="group-hover:text-[#1d9bf0]"
                hoverBg="group-hover:bg-[#1d9bf0]/10"
              />
              <InteractionButton
                Icon={Repeat2}
                count={tweet.repost}
                hoverColor="group-hover:text-[#00ba7c]"
                hoverBg="group-hover:bg-[#00ba7c]/10"
              />
              <InteractionButton
                Icon={Heart}
                count={tweet.likes}
                hoverColor="group-hover:text-[#f91880]"
                hoverBg="group-hover:bg-[#f91880]/10"
              />
              <InteractionButton
                Icon={BarChart3}
                count={tweet.views}
                hoverColor="group-hover:text-[#1d9bf0]"
                hoverBg="group-hover:bg-[#1d9bf0]/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// --- DEFINISI KOMPONEN INI SANGAT PENTING ---
const InteractionButton = ({ Icon, count, hoverColor, hoverBg }) => (
  <div className="flex items-center group cursor-pointer transition-colors">
    <div className={`p-2 rounded-full transition-colors ${hoverBg}`}>
      <Icon size={18} className={`transition-colors ${hoverColor}`} />
    </div>
    <span className={`text-[13px] ml-0.5 transition-colors ${hoverColor}`}>
      {count || 0}
    </span>
  </div>
);

export default TweetCard;
