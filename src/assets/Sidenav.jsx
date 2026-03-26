import { useUser, UserButton, SignOutButton, UserProfile, useClerk } from '@clerk/clerk-react';
import { DatabaseSearch, Ellipsis, FlameIcon, HomeIcon, List, LogIn, LogOut, LogOutIcon, Snowflake, TrendingUp, Video } from 'lucide-react'
import {useState} from 'react';
const Sidenav = () => {

const { user } = useUser();
  const { openUserProfile } = useClerk();
// const userrole = user?.publicMetadata?.Role || 'User'; // Default ke 'User' jika role tidak ada

  
  const handlemenudrpodwon = () => {
    const dropdown = document.querySelector('.group-hover\\:block');
    if (dropdown) {
      dropdown.classList.toggle('hidden');
    }
  }
  
  
  console.log(user);
    
  return (
    <div className="h-screen col-span-4  lg:block bg-white flex items-center px-4 py-6 flex-col justify-start relative overflow-hidden">
      <div className="flex items-center gap-x-2">
        <Snowflake color="blue" size={50} />
        <h1 className="lg:text-4xl font-bold md:text-3xl">Nonnesx</h1>
      </div>
      <legend className="w-full border-b-4 border-gray-300/30 shadow-xl shadow-gray-500/10 pb-0">
        <ul className="flex flex-col gap-y-2 mt-6 w-full">
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

      <legend
        role="button"
        className="absolute left-0 bottom-0 mb-5 w-full border-b-4 border-gray-300/30 shadow-xl shadow-gray-500/10 pb-0 mt-6 duration-100 hover:bg-gray-500/20"
        onClick={() => openUserProfile()}
      >
        <div className="px-4 flex items-center gap-x-4 py-2 border-none">
          <div className="rounded-full px-1 bg-gray-500/20 flex items-center justify-center py-1">
            <img
              src={user?.imageUrl}
              alt="Profile"
              className="rounded-full w-8 h-8 object-cover"
            />
          </div>
          <div className="">
            <h5 className="font-bold capitalize">{user?.fullName}</h5>
            <p className="text-gray-500 text-sm">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
          <div className="relative right-0 top-0 flex items-center justify-center group">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Mencegah tombol luar terpicu
                handlemenudrpodwon();
              }}
              className="hover:bg-gray-800/20 px-3 cursor-pointer"
            >
              <Ellipsis />
            </button>
            <div className="absolute -left-40 w-40 rounded-sm hidden group-hover:block bg-blue-500 backdrop-blur-1xl shadow-lg py-2 px-4">
              <li className="px-4 py-2 hover:bg-green-500 duration-150 hover:text-white font-bold cursor-pointer flex items-center gap-x-2 text-sm rounded-sm">
                <LogOutIcon className="inline-block" size={19}/>
                <SignOutButton />
              </li>
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-x-2 px-4 py-2 w-full
        flex-wrap gap-y-2"
        >
          {/* {userrole && userrole.length > 0 ? (
            userrole.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: item.color_background,
                  fontWeight: "bold",
                }}
                className="px-2 capitalize rounded-2xl py-1.5 text-shadow-2xs
                 text-center  "
              >
                <p className="text-[10px] text-white">{item.role_name}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No roles found</p>
          )} */}
        </div>
      </legend>
    </div>
  );
}

export default Sidenav