import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { Link } from "react-router-dom";
import type { Project } from "../../features/api/apiSlice";

interface ProjectNavItemProps {
  project: Project;
  closeNavigation: () => void;
}

export const ProjectNavItem = ({ project, closeNavigation }: ProjectNavItemProps) => {
  const [showPages, setShowPages] = useState<boolean>(false);

  const selectProject = () => {
    setShowPages(true);
    closeNavigation();
  };

  return (
    <section>
      <div className="flex bg-dark-blue-200 border-b border-solid border-dark-blue-100 px-6 py-3 overflow-auto justify-between">
        <Link
          to={`/projects/${project.id}/${project.pages.length > 0 ? project.pages[0].id : ""}`}
          onClick={() => selectProject()}
          className={`overflow-x-hidden *:m-0 p-0 text-left leading-8 heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:outline-none focus:ring-0 focus:text-caution-100 
          ${window.location.pathname.includes(`/projects/${project.id}/`) ? "text-caution-100" : "text-light-font"} ${!project.name.includes(" ") && "break-all"}`} >
          {project.name}
        </Link>

        <button
          className="m-0 p-0 font-light heading-xs text-light-font hover:text-primary-200 bg-grayscale-0 hover:bg-grayscale-0 focus:outline-none focus:ring-0 focus:text-caution-100"
          onClick={() => setShowPages(!showPages)}
        >
          {project.pages.length > 0 && 
          (showPages ? <ChevronUp size={20}/> : <ChevronDown size={20}/>)
          }
        </button>
      </div>

      {showPages &&
        project.pages.map((page) => (
          <Link
            key={page.id}
            to={`/projects/${project.id}/${page.id}`}
            onClick={() => closeNavigation()}
            className={`block overflow-x-hidden w-full px-6 py-3 text-left body-text-sm text-light-fonts border-b border-solid border-dark-blue-100 hover:bg-dark-blue-100 bg-grayscale-0 focus:outline-none focus:bg-dark-blue-100 
            ${window.location.pathname.endsWith(`/projects/${project.id}/${page.id}`) && "underline"} ${!page.name.includes(" ") && "break-all"}`}
          >
            {page.name}
          </Link>
        ))}
    </section>
  );
};
