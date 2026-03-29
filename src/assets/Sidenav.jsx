import React, { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import {
  Ellipsis,
  FlameIcon,
  HomeIcon,
  List,
  LogOutIcon,
  Snowflake,
  Video,
  User,
  Plus,
  SendHorizonal,
} from "lucide-react";
import Modal from "./lib/modalpost";
import Modalvideo from "./lib/VideoPostModal";
const Sidenav = () => {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { icon: <HomeIcon size={28} />, label: "Home" },
    { icon: <FlameIcon size={28} />, label: "Trending" },
    { icon: <List size={28} />, label: "Lists" },
    { icon: <Video size={28} />, label: "Reels" },
    {
      icon: <User size={28} />,
      label: "Profile",
      onClick: () => openUserProfile(),
    },
  ];

  return (
    <>
      {/* --- DESKTOP & TABLET SIDEBAR (Kiri) --- */}
      <div
        className=" hidden sm:flex flex-col h-screen sticky top-0 bg-black border-r border-gray-800 text-white 
                      w-20 xl:w-100 px-2 xl:px-4 py-3 justify-between items-center xl:items-start transition-all"
      >
        <div className="flex flex-col w-full items-center xl:items-start ">
          {/* Logo */}
          <div className="p-3 w-full hover:bg-gray-900 cursor-pointer transition flex items-center gap-x-3">
            <Snowflake className="text-blue-400" size={32} />
            <p className="text-4xl font-bold hidden xl:block">Nonnesx</p>
          </div>

          {/* Navigation Items */}
          <nav className="mt-4 space-y-1 w-full">
            {navItems.map((item, idx) => (
              <div
                key={idx}
                onClick={item.onClick}
                className="flex items-center gap-5 p-3 w-full xl:pr-8 hover:bg-gray-900 cursor-pointer transition group"
              >
                <span className="text-white group-hover:scale-105 transition-transform">
                  {item.icon}
                </span>
                <span className="text-xl font-normal hidden xl:block">
                  {item.label}
                </span>
              </div>
            ))}
          </nav>

          {/* Post Button (X Style) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-10 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full 
                             w-12 h-12 xl:w-full xl:h-12 flex items-center justify-center transition shadow-lg"
          >
            <SendHorizonal className="xl:hidden block" size={24} />
            <SendHorizonal className="xl:block sm:hidden mr-2" size={24} />
            <span className="hidden xl:block">
              <span>Post Your Tweets</span>
            </span>
          </button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-10 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full 
                             w-12 h-12 xl:w-full xl:h-12 flex items-center justify-center transition shadow-lg"
          >
            <SendHorizonal className="xl:hidden block" size={24} />
            <SendHorizonal className="xl:block sm:hidden mr-2" size={24} />
            <span className="hidden xl:block">
              <span>Post Your Videos</span>
            </span>
          </button>
          <Modalvideo
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>

        {/* Profile Section */}
        <div className="relative w-full">
          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 w-64 mb-4 bg-black border border-gray-800 shadow-[0_0_15px_rgba(255,255,255,0.1)]  overflow-hidden z-50 py-2">
              {/* TOMBOL EDIT PROFILE DI DROPDOWN */}
              <button
                onClick={() => {
                  openUserProfile();
                  setIsDropdownOpen(false); // Tutup dropdown setelah buka profil
                }}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-900 transition font-bold text-sm text-white border-b border-gray-800"
              >
                <User size={18} /> Settings & Privacy
              </button>

              {/* TOMBOL SIGN OUT */}
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-900 transition font-bold text-sm text-red-500"
              >
                <LogOutIcon size={18} />
                <p>Sign Account @{user?.username || "user"}</p>
              </button>
            </div>
          )}

          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between p-3 hover:bg-gray-900  cursor-pointer transition w-full"
          >
            <div className="flex items-center gap-3">
              <img
                src={user?.imageUrl}
                alt="pfp"
                className="size-10 rounded-full"
              />
              <div className="hidden xl:flex flex-col leading-tight capitalize">
                <span className="font-bold text-[15px]">{user?.fullName}</span>
                <span className="text-gray-500 text-[15px]">
                  @{user?.username || "user"}
                </span>
              </div>
            </div>
            <Ellipsis size={20} className="hidden xl:block text-gray-500" />
          </div>
        </div>
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION (Muncul di layar HP < 640px) --- */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 h-16 flex items-center justify-around text-white z-50 px-2">
        {navItems.slice(0, 4).map((item, idx) => (
          <div key={idx} className="p-2 active:bg-gray-900 rounded-full">
            {item.icon}
          </div>
        ))}
        {/* Mobile Profile Trigger */}
        <img
          src={user?.imageUrl}
          onClick={() => openUserProfile()}
          alt="pfp"
          className="size-7 rounded-full border border-gray-700"
        />
      </div>
    </>
  );
};

export default Sidenav;
