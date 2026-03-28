import React from "react";
import {
  MessageCircle,
  Repeat2,
  Heart,
  BarChart3,
  Share,
  MoreHorizontal,
  BadgeCheck,
} from "lucide-react";

// Terima 'tweet' sebagai props dari Parent (Feed)
const TweetCard = ({ tweet }) => {
  if (!tweet) return null;

  // Helper untuk format handle dari email
  const userHandle = tweet.email_user?.split("@")[0].toLowerCase() || "user";

  return (
    <div className="max-w-[600px] w-full bg-black border-b border-zinc-800 p-4 hover:bg-zinc-900/30 transition-colors cursor-pointer font-sans text-white">
      <div className="flex gap-3">
        {/* Avatar Section */}
        <div className="shrink-0">
          <img
            src={tweet.avatar_user || "https://unavatar.io/twitter/placeholder"}
            alt="Avatar"
            className="w-10 h-10 rounded-full bg-zinc-800 object-cover border border-zinc-800"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 w-full min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              <span className="font-bold text-[15px] hover:underline flex items-center gap-1 truncate text-zinc-100">
                {tweet.name_user}
                {tweet.isverified_user && (
                  <BadgeCheck
                    size={16}
                    className="text-[#1d9bf0] fill-[#1d9bf0] shrink-0"
                  />
                )}
              </span>
              <span className="text-[#71767b] text-[15px] truncate">
                @{userHandle}
              </span>
              <span className="text-[#71767b] text-[15px]">·</span>
              <span className="text-[#71767b] text-[15px] hover:underline shrink-0">
                {new Date(tweet.$createdAt).toLocaleDateString()}
              </span>
            </div>
            <button className="text-[#71767b] hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-1.5 rounded-full transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Teks Postingan */}
          <div className="text-[15px] text-[#e7e9ea] whitespace-pre-wrap leading-normal mt-1">
            {tweet.content_post}
          </div>

          {/* Gambar Postingan */}
          {tweet.image_post && tweet.image_post !== "minus" && (
            <div className="mt-3 rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900">
              <img
                src={tweet.url_image_post || tweet.image_post}
                alt="Post content"
                className="w-full h-auto object-cover max-h-[512px]"
                loading="lazy"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-3 text-[#71767b] max-w-[425px]">
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
            <div className="p-2 hover:bg-[#1d9bf0]/10 rounded-full hover:text-[#1d9bf0] transition-colors">
              <Share size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionIcon = ({ Icon, count, hoverColor, hoverBg }) => (
  <button
    className={`flex items-center gap-1 group transition-colors px-2 py-1 ${hoverColor}`}
  >
    <div className={`p-2 ${hoverBg} rounded-full transition-colors`}>
      <Icon size={18} />
    </div>
    <span className="text-[13px]">{count || 0}</span>
  </button>
);

export default TweetCard;
