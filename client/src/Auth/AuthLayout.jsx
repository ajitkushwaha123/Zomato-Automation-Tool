import React from "react";
import { dashboardVideo } from "../assets";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-full bg-backy bg-cover bg-repeat h-screen flex justify-center items-center">
      <div className="w-[40%] px-10 flex justify-center items-center h-full">
        <Outlet />
      </div>
      <div className="w-[60%] h-full bg-gray-100">
        <video className="w-full h-full object-cover" autoPlay loop muted>
          <source src={dashboardVideo} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default AuthLayout;
