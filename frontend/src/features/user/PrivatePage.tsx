import { Outlet } from "react-router-dom";
import { DashboardNav } from "./DashboardNav";
import { ProjectHeader } from "../project/ProjectHeader";
import useScreenDimensions from "../../utils/screenDimensions";

export const PrivatePage = () => {
  const screenDimensions = useScreenDimensions();

  return (
    <>
      {screenDimensions.width > 640
        ?
        <div className="flex flex-row h-screen w-full bg-grayscale-200">
          <DashboardNav />
          <div className="relative flex flex-col w-full overflow-auto">
            <ProjectHeader />
            <Outlet />
          </div>
        </div>
        :
        <div className="flex flex-col w-full bg-grayscale-200 min-h-screen max-h-screen">
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
