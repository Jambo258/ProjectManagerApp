import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { Link } from "react-router-dom";
import type { Project } from "../../features/api/apiSlice";

interface ProjectNavItemProps {
  project: Project;
}

export const ProjectNavItem = ({ project }: ProjectNavItemProps) => {
  const [showPages, setShowPages] = useState<boolean>(false);

  return (
    <section>
      <div className="bg-dark-blue-200 border-b border-solid border-dark-blue-100 px-6 py-3 overflow-auto flex justify-between">
        <Link
          to={"/"}
          onClick={() => console.log("Open " + project.name)}
          className="m-0 p-0 text-left leading-8 heading-xs text-light-font bg-grayscale-0 hover:bg-grayscale-0 focus:outline-none focus:ring-0 focus:text-caution-100"
        >
          {project.name}
        </Link>

        <button
          className="m-0 p-0 font-light heading-xs text-light-font hover:text-primary-200 bg-grayscale-0 hover:bg-grayscale-0 focus:outline-none focus:ring-0 focus:text-caution-100"
          onClick={() => setShowPages(!showPages)}
        >
          {showPages ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {showPages &&
        project.pages.map((page) => (
          <Link
            key={page.id}
            to={`/pages/${page.id}`}
            onClick={() => console.log("Open " + page.name)}
            className="block w-full px-6 py-3 text-left body-text-sm text-light-font border-b border-solid border-dark-blue-100 hover:bg-dark-blue-100 bg-grayscale-0 focus:outline-none focus:bg-dark-blue-100"
          >
            {page.name}
          </Link>
        ))}
    </section>
  );
};
