import { Outlet } from "react-router";
import { ProjectHeader } from "../components/ProjectHeader";

export const ProjectView = () => {
  return (
    <section className="bg-grayscale-200 min-h-full">
      <ProjectHeader />
      <Outlet />
    </section>
  );
};
