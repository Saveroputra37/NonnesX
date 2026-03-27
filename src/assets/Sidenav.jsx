import { useUser, UserButton, SignOutButton, UserProfile, useClerk } from '@clerk/clerk-react';
import {
  DatabaseSearch,
  Ellipsis,
  FlameIcon,
  GaugeCircle,
  HomeIcon,
  List,
  LogIn,
  LogOut,
  LogOutIcon,
  Snowflake,
  TrendingUp,
  Video,
  CircleUser,
} from "lucide-react";
import { useUserList } from "../data/QueryUser/queryuser.jsx";
const Sidenav = () => {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const userrole = user?.publicMetadata?.Role || "User";
  const { signOut } = useClerk();
  const query = useUserList();
  const { data, isLoading, error } = query;
  const handlemenudrpodwon = () => {
    const dropdown = document.querySelector(".group-hover\\:block");
    if (dropdown) {
      dropdown.classList.toggle("hidden");
    }
  };

  const handlechangeaccount = () => {
    signOut();
  };

  return (
    <div className="hidden sm:hidden h-screen xl:block xl:w-[25%] 2xl:w-[17%] bg-[#FFF0F0] items-center px-4 py-6 flex-col justify-start relative overflow-hidden">
      <div className="flex items-center gap-x-2">
        <Snowflake color="blue" size={50} />
        <h1 className="lg:text-4xl font-bold md:text-3xl">Nonnesx</h1>
      </div>
      <legend className="w-full border-b-4 border-t-2 mt-2 bg-white border-gray-300/40 shadow-xl shadow-gray-500/10 rounded-lg pb-0">
        <ul className="flex flex-col gap-y-2  w-full">
          <li className="text-lg font-medium cursor-pointer w-full border-2 pl-4 py-2 border-none flex items-center duration-100 hover:bg-blue-500 hover:text-white rounded-md ">
            <HomeIcon className="inline-block mr-2" />
            <p className="pl-1">Home Pages</p>
          </li>
          <li className="text-lg font-medium cursor-pointer w-full border-2 pl-4 py-2 border-none flex items-center duration-100 hover:bg-blue-500 hover:text-white rounded-md ">
            <FlameIcon className="inline-block mr-2" />
            <p className="pl-1">Trending Checks</p>
          </li>
          <li className="text-lg font-medium cursor-pointer w-full border-2 pl-4 py-2 border-none flex items-center duration-100 hover:bg-blue-500 hover:text-white rounded-md ">
            <List className="inline-block mr-2" />
            <p className="pl-1">List Content</p>
          </li>
          <li className="text-lg font-medium cursor-pointer w-full border-2 pl-4 py-2 border-none flex items-center duration-100 hover:bg-blue-500 hover:text-white rounded-md ">
            <Video className="inline-block mr-2" />
            <p className="pl-1">Reels Content Video</p>
          </li>
        </ul>
      </legend>
      <legend className="w-full border-b-4 border-t-2 mt-2 bg-white border-gray-300/40 shadow-xl shadow-gray-500/10 pb-0 rounded-lg">
        <ul className="flex flex-col gap-y-2 w-full">
          {data && data.length > 0 ? (
            data.map((item) => (
              <li
                key={item.$id}
                className="bg-amber-200/30 hover:bg-blue-500/20  text-lg font-medium cursor-pointer w-full border-2 pl-4 py-2 border-none flex items-center duration-100  rounded-md overflow-hidden "
              >
                <img
                  src={item.user_image_url}
                  alt={`${item.firstName} ${item.lastName}`}
                  className="size-8 rounded-full mr-2 object-cover"
                />
                <div className="flex flex-col">
                  <p className="pl-1">
                    {item.firstName} {item.lastName}
                  </p>
                  <p className="text-sm text-gray-500 pl-1">{item.email}</p>
                </div>
              </li>
            ))
          ) : (
            <p> Tidak ada data </p>
          )}
        </ul>
      </legend>
      <legend
        role="button"
        className="absolute left-0 bottom-0 mb-2 w-full border-b-4 bg-white border-gray-300/30 shadow-xl pb-0 mt-6 duration-100 rounded-lg hover:bg-gray-500/20"
        onClick={() => openUserProfile()}
      >
        <div className="px-4 flex items-center gap-x-1 w-full py-2">
          <div className="">
            <img
              src={user?.imageUrl}
              alt="Profile"
              className="size-8 rounded-full mr-2 object-cover"
            />
          </div>
          <div className="">
            <h5 className="font-bold capitalize">{user?.fullName}</h5>
            <p className="text-gray-500 text-[10px]">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
          <div className="absolute right-0 top-0 m-2 group">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlemenudrpodwon();
              }}
              className="hover:bg-gray-800/20 px-3 cursor-pointer"
            >
              <Ellipsis />
            </button>
            <div className="absolute -left-20 top-5 w-40 rounded-sm hidden group-hover:block  backdrop-blur-1xl shadow-lg ">
              <SignOutButton>
                <li className="px-4 py-2 bg-amber-50 hover:bg-green-500 duration-150 hover:text-white font-bold cursor-pointer flex items-center gap-x-2 text-sm rounded-sm">
                  <LogOutIcon className="inline-block" size={19} />
                  <p className="inline-block text-[12px] font-bold">Sign Out</p>
                </li>
              </SignOutButton>
              <div
                role="button"
                onClick={handlechangeaccount}
                className="px-4 py-2 bg-amber-50 hover:bg-blue-500 duration-150 hover:text-white font-bold cursor-pointer flex items-center gap-x-2 text-sm rounded-sm"
              >
                <GaugeCircle className="inline-block" size={19} />
                <p className="inline-block text-[12px] font-bold">
                  Change Account
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-x-2 px-4 py-2 w-full
        flex-wrap gap-y-2"
        >
          {userrole && userrole.length > 0 ? (
            userrole.map((item) => (
              <div
                key={item.role_key}
                style={{
                  backgroundColor: item.bg_color,
                  fontWeight: "bold",
                }}
                className="px-2 capitalize rounded-2xl py-1.5 text-shadow-2xs
                 text-center  "
              >
                <p className="text-[10px] text-white">{item.role_user}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No roles found</p>
          )}
        </div>
      </legend>
    </div>
  );
};

export default Sidenav