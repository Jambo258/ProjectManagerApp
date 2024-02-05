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
          <div className="relative flex flex-col w-full overflow-auto">
            <ProjectHeader />
            <Outlet />
          </div>
        </div>
        :
        <div className="flex flex-col h-screen w-full bg-grayscale-200">
          <DashboardNav />
          <div className="relative flex flex-col w-full h-fit min-h-[calc(100%-3.5rem)] overflow-auto">
            <ProjectHeader />
            <Outlet />
          </div>
        </div>
      }
    </>
  );
};
