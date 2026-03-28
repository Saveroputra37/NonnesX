import React from "react";
import { Search, MoreHorizontal, CheckCircle2 } from "lucide-react";

const DarkRightSidebar = () => {
  const trends = [
    { category: "Technology · Trending", topic: "#ReactJS", posts: "45.2K" },
    {
      category: "Programming · Trending",
      topic: "Tailwind CSS v4",
      posts: "12.5K",
    },
    { category: "Development", topic: "Fullstack Web", posts: "8.9K" },
  ];

  const suggestions = [
    { name: "Gemini AI", handle: "@GoogleGemini", verified: true },
    { name: "Nonnesx Dev", handle: "@nonnesx_app", verified: false },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[450px] gap-4 p-4 sticky top-0 h-screen overflow-y-auto bg-black text-zinc-100 border-l border-zinc-800">
      {/* Search Bar - Sticky with Glass Effect */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-xl pb-2 z-10">
        <div className="relative group mt-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-zinc-900 border border-transparent rounded-full py-3 pl-12 pr-4 focus:ring-1 focus:ring-blue-500 focus:bg-black focus:border-blue-500 outline-none transition-all placeholder:text-zinc-500 text-sm"
          />
        </div>
      </div>

      {/* What's happening Section */}
      <section className="bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
        <h2 className="px-4 py-3 text-xl font-extrabold tracking-tight">
          What's happening
        </h2>

        {trends.map((trend, index) => (
          <div
            key={index}
            className="px-4 py-3 hover:bg-zinc-900 cursor-pointer transition-colors flex justify-between items-start group"
          >
            <div className="flex-1">
              <p className="text-[13px] text-zinc-500">{trend.category}</p>
              <p className="font-bold text-[15px] mt-0.5 group-hover:underline">
                {trend.topic}
              </p>
              <p className="text-[13px] text-zinc-500 mt-1">
                {trend.posts} posts
              </p>
            </div>
            <button className="p-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-full transition-colors">
              <MoreHorizontal className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
        ))}

        <button className="w-full text-left px-4 py-4 text-blue-500 hover:bg-zinc-900 transition-colors text-sm font-medium">
          Show more
        </button>
      </section>

      {/* Who to follow Section */}
      <section className="bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
        <h2 className="px-4 py-3 text-xl font-extrabold tracking-tight">
          Who to follow
        </h2>

        {suggestions.map((user, index) => (
          <div
            key={index}
            className="px-4 py-3 hover:bg-zinc-900 cursor-pointer transition-colors flex items-center justify-between"
          >
            <div className="flex gap-3">
              {/* Avatar Placeholder */}
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 group">
                  <span className="font-bold text-sm group-hover:underline">
                    {user.name}
                  </span>
                  {user.verified && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500" />
                  )}
                </div>
                <span className="text-sm text-zinc-500 leading-tight">
                  {user.handle}
                </span>
              </div>
            </div>
            <button className="bg-zinc-100 text-black font-bold text-sm py-1.5 px-5 rounded-full hover:bg-zinc-200 transition-colors">
              Follow
            </button>
          </div>
        ))}

        <button className="w-full text-left px-4 py-4 text-blue-500 hover:bg-zinc-900 transition-colors text-sm font-medium">
          Show more
        </button>
      </section>

      {/* Footer (Terms & Copyright) */}
      <footer className="px-4 text-[13px] text-zinc-500 flex flex-wrap gap-x-3 gap-y-1 mt-2">
        <span className="hover:underline cursor-pointer">Terms of Service</span>
        <span className="hover:underline cursor-pointer">Privacy Policy</span>
        <span className="hover:underline cursor-pointer">Accessibility</span>
        <span>© 2026 X Corp.</span>
      </footer>
    </aside>
  );
};

export default DarkRightSidebar;
