import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { Link } from "react-router-dom";

// Interfaces for testing purposes
interface Page {
  id: number,
  name: string
}

interface Project {
  id: number,
  name: string,
  pages: Page[]
}

interface ProjectNavItemProps {
  project: Project
}

export const ProjectNavItem = ({project}: ProjectNavItemProps) => {
  const [showPages, setShowPages] = useState<boolean>(false);

  return (
    <>
      <div
        className="bg-dark-blue-200 border-b border-solid border-dark-blue-100 heading-sm px-6 py-3 overflow-auto flex justify-between">

        <Link to={"/"}>
          <button onClick={() => console.log("Open " + project.name)} className="leading-8 m-0 p-0 text-left bg-grayscale-0 hover:bg-grayscale-0 text-light-font">
            {project.name}
          </button>
        </Link>

        <button className="font-light heading-xs m-0 p-0 bg-grayscale-0 hover:bg-grayscale-0 text-light-font hover:text-primary-200"
          onClick={() => setShowPages(!showPages)}>
          {showPages ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>

      </div>

      {showPages && (
        project.pages.map(page => (
          <Link key={page.id} to={"/"}>
            <button 
              onClick={() => console.log("Open " + page.name)}
              className="border-b border-solid border-dark-blue-100 body-text-md heading-sm px-6 py-3 
              hover:bg-dark-blue-100  w-full text-left bg-grayscale-0 text-light-font">
              {page.name}
            </button>
          </Link>
        ))
      )}
    </>

  );
};
