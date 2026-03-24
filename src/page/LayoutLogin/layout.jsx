import React, { useState } from 'react'
import Usercreatepage from "../../assets/Usercreatepage";
import Userloginpage from "../../assets/Userloginpage";
import SlideLoginTemp from "../../assets/SlideLoginTemp";

const layout = () => {
  const [isCreateMode, setIsCreateMode] = useState(true);

  return (
    <div className="flex h-screen w-full items-center justify-center rounded-lg ">
      <div className="w-[80%] h-[90%] flex">
        <div className="sm:hidden md:block md:w-[40%] lg:w-[65%] hidden border rounded-l-lg overflow-hidden">
          <SlideLoginTemp />
        </div>
        <div className="w-full md:w-[60%] lg:w-[35%] bg-white rounded-r-lg p-8 flex flex-col">
          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsCreateMode(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
                isCreateMode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
               Daftar Langsung
            </button>
            <button
              onClick={() => setIsCreateMode(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
                !isCreateMode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Masuk Akun
            </button>
          </div>

          {/* Conditional Component Rendering */}
          <div className="flex-1 overflow-y-auto">
            {isCreateMode ? <Usercreatepage /> : <Userloginpage />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default layout