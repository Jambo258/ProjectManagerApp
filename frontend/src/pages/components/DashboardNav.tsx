import { useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { ProjectNavItem } from "./ProjectNavItem";
import { ProfileModal } from "./profilemodal";
import CreateProjectModal from "./CreateProjectModal";

// Example project for mockup purposes
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
    <nav className={`bg-dark-blue-300 min-h-screen text-light-font flex-shrink-0 ${collapseNav ? "w-72" : "w-12"}`}>
      <div className="min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="sticky top-0 grid grid-flow-col justify-end bg-dark-blue-300">
          <button
            className="w-fit p-4 heading-md text-light-font hover:text-primary-200 bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
            onClick={() => setcollapseNav(!collapseNav)}
          >
            {collapseNav ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {collapseNav && <section>
          <h4 className="px-6 mb-6 heading-md">
              Project <br /> Management App
          </h4>

          <div className="grid grid-flow-col px-6 py-4 items-center border-b border-solid border-dark-blue-100">
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
        </section>}
      </div>

      {collapseNav &&
      <section className="grid grid-flow-col w-full h-16 px-4 py-2 items-center bg-dark-blue-100">
        <ProfileModal />
        
        <div>
          <button
            onClick={() => console.log("Log out")}
            className="float-right w-fit p-2 heading-xs text-light-font bg-grayscale-0 hover:text-primary-200 hover:bg-grayscale-0"
          >
            <p>Log out</p>
          </button>
        </div>
      </section>
      }

    </nav>
  );
};
