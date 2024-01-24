import { Outlet } from "react-router-dom";
import { DashboardNav } from "./DashboardNav";
import { ProjectHeader } from "../project/ProjectHeader";
import { useEffect, useState } from "react";

export const PrivatePage = () => {
  const [width, setWidth]  = useState(window.innerWidth);

  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };
  
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  
  return (
    <>
      {width > 640 
        ? 
        <div className="flex flex-row h-screen w-full bg-grayscale-200">
          <DashboardNav />
          <div className="flex flex-col w-full overflow-hidden">
            <ProjectHeader />
            <Outlet />
          </div>
        </div>
        :
        <div className="h-screen w-full bg-grayscale-200">
          <div className="flex flex-col w-full overflow-hidden">
            <DashboardNav />
            <ProjectHeader />
            <Outlet />
          </div>
        </div>
      }
    </>
  );
};
