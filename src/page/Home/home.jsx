import React from "react";
import Sidenav from "../../assets/Sidenav";

const home = () => {
  return (
    <div className="grid grid-cols-12">
      <Sidenav />
      <p className="col-span-8 p-4">Welcome to the Home Page</p>
    </div>
  );
};

export default home;
