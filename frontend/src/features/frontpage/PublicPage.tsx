import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";

export const PublicPage = () => {
  return (
    <div className="w-full h-screen bg-grayscale-200 overflow-hidden">
      <div className="absolute w-full">
        <NavBar />
      </div>
      <div className="mt-24 h-[calc(100%-7rem)] overflow-auto">
        <Outlet/>
      </div>
    </div>
  );
};
