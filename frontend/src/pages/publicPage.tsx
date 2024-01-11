import { Outlet } from "react-router-dom";
import { NavBar } from "./components/NavBar";

export const PublicPage = () => {
  return (
    <div className="w-full min-h-screen bg-grayscale-200">
      <NavBar />
      <Outlet/>
    </div>
  );
};
