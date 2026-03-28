import React from "react";
import Sidenav from "../../assets/Sidenav";
import Indexpage from "../../assets/Indexpage";
import RightSidebar from "../../assets/Rightnav";

const home = () => {
  return (
    <div className="flex h-screen w-full">
      <Sidenav />
      <div className="w-full">
        <Indexpage />
      </div>
      <RightSidebar />
    </div>
  );
};

export default home;
