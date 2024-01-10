import { useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { ProjectNavItem } from "./ProjectNavItem";
import { ProfileModal } from "./profilemodal";
import CreateProjectModal from "./CreateProjectModal";

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
      <div className="min-h-[calc(100vh-4rem)] h-[calc(100%-4rem)]">
        <div className="grid grid-flow-col justify-end">
          <button className="w-fit text-light-font hover:text-primary-200 bg-grayscale-0 hover:bg-grayscale-0 p-4 heading-md" 
            onClick={() => setcollapseNav(!collapseNav)}>
            {collapseNav ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {collapseNav
          ? <section>
            <h4 className="px-6 mb-6 heading-md">
              Project <br /> Management App
            </h4>

            <div className="grid grid-flow-col items-center px-6 py-4 border-b border-solid border-dark-blue-100">
              <div className="heading-sm">
                My projects
              </div>
              <div className="text-right">
                <CreateProjectModal />
              </div>
            </div>

            {exampleProjects.map(project =>
              <div key={project.id}>
                <ProjectNavItem project={project} />
              </div>
            )}
          </section>

          : null}
      </div>

      {collapseNav 
        ? <section className="px-4 py-2 grid grid-flow-col items-center bg-dark-blue-100 w-full h-16">
          <ProfileModal />
         
          <div>
            <button className="bg-grayscale-0 heading-xs text-light-font hover:text-primary-200 w-fit p-2 float-right 
              hover:bg-grayscale-0 " onClick={() => console.log("Log out")}>
              <p>Log out</p>
            </button>
          </div>
        </section>

        : null}

    </nav>
  );
};
