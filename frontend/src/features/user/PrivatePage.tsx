import { Outlet } from "react-router-dom";
import { DashboardNav } from "./DashboardNav";
import { ProjectHeader } from "../project/ProjectHeader";

export const PrivatePage = () => {
  return (
    <div className="flex flex-row h-screen w-full bg-grayscale-200">
      <DashboardNav />
      <div className="flex flex-col w-full overflow-hidden">
        <ProjectHeader />
        <Outlet />
      </div>
    </div>
  );
};
