import { useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { ProjectNavItem } from "./ProjectNavItem";

// example project for mockup purposes

const exampleProjects = [
  {
    "id": 1,
    "name": "Personal Project",
    "pages": [
      {
        "id": 11,
        "name": "To Dos"
      },
      {
        "id": 21,
        "name": "Notepad"
      }
    ]
  },
  {
    "id": 2,
    "name": "Group Project",
    "pages": [
      {
        "id": 21,
        "name": "Task Board"
      },
      {
        "id": 22,
        "name": "To do"
      },
      {
        "id": 23,
        "name": "Notepad"
      }
    ]
  }
];

// TO DO:
// Properly link existing projects and pages
// Open user settings
// Logout

export const DashboardNav = () => {
  const [collapseNav, setcollapseNav] = useState<boolean>(true);
 
  return (
    <nav className={`bg-dark-blue-300 min-h-screen text-light-font ${collapseNav ? "w-72" : "w-12"}`}>
      <div className="min-h-[calc(100vh-4rem)]">
        <div className="mb-8 grid grid-flow-col justify-end">
          <button className="w-fit text-light-font hover:text-primary-200 bg-grayscale-0 hover:bg-grayscale-0 p-4 heading-md" 
            onClick={() => setcollapseNav(!collapseNav)}>
            {collapseNav ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {collapseNav
          ?
          <>
            <h4 className="px-6 mb-6 heading-md">
              Project <br /> Management App
            </h4>

            <div className="grid grid-flow-col items-center px-6 py-4 border-b border-solid border-dark-blue-100">
              <div className="heading-md">
                My projects
              </div>
              <div className="text-right">
                <button className="rounded-full p-0 h-7 w-7 heading-md" onClick={() => console.log("Add new project")}>
                  <p className="-mt-1.5">+</p>
                </button>
              </div>
            </div>

            {exampleProjects.map(project =>
              <div key={project.id}>
                <ProjectNavItem project={project} />
              </div>
            )}
          </>

          : null}
      </div>

      {collapseNav 
        ? 
        <div className="px-4 py-2 grid grid-flow-col items-center bg-dark-blue-100 w-full h-16">
          <button className="bg-purple-200 hover:bg-purple-200 rounded-full m-0 p-0 w-8 h-8 text-light-font text-center heading-sm leading-8 " 
            onClick={() => console.log("Open user settings")}>
            A
          </button>
          <div>
            <button className="bg-grayscale-0 heading-xs text-light-font hover:text-primary-200 w-fit p-2 float-right 
              hover:bg-grayscale-0 " onClick={() => console.log("Log out")}>
              <p>Log out</p>
            </button>
          </div>
        </div>

        : null}

    </nav>
  );
};
