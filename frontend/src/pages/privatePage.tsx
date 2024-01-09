import { Outlet } from "react-router-dom";
import { DashboardNav } from "./components/DashboardNav";

export const PrivatePage = () => {
  return (
    <div className="min-h-screen bg-grayscale-200 flex">
      <DashboardNav />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};
