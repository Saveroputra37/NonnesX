import React from "react";
import Sidenav from "../../assets/Sidenav";
import Indexpage from "../../assets/Indexpage";

const home = () => {
  return (
    <div className="flex h-screen w-full">
      <Sidenav />
      <Indexpage />
    </div>
  );
};

export default home;
