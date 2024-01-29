import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { Link } from "react-router-dom";
import type { Project } from "../../features/api/apiSlice";

interface ProjectNavItemProps {
  project: Project;
  closeNav: () => void;
}

export const ProjectNavItem = ({ project, closeNav }: ProjectNavItemProps) => {
  const [showPages, setShowPages] = useState<boolean>(false);

  return (
    <section>
      <div className="bg-dark-blue-200 border-b border-solid border-dark-blue-100 px-6 py-3 overflow-auto flex justify-between">
        <Link
          to={`/projects/${project.id}`}
          onClick={() => closeNav()}
          className={`m-0 p-0 text-left leading-8 heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:outline-none focus:ring-0 focus:text-caution-100 ${window.location.pathname.includes(`/projects/${project.id}`) ? "text-caution-100" : "text-light-font"}`} >
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
            onClick={() => closeNav()}
            className={`block w-full px-6 py-3 text-left body-text-sm text-light-font border-b border-solid border-dark-blue-100 hover:bg-dark-blue-100 bg-grayscale-0 focus:outline-none focus:bg-dark-blue-100 ${window.location.pathname.includes(`/projects/${project.id}/${page.id}`) && "underline"}`}
          >
            {page.name}
          </Link>
        ))}
    </section>
  );
};
