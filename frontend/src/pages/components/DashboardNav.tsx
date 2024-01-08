import { useState } from "react";
import { Link } from "react-router-dom";

// Interfaces and example projects for mockup purposes
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
  const [collapse, setCollapse] = useState<boolean>(true);
 
  return (
    <div className={`bg-dark-blue-300 min-h-screen text-light-font ${collapse ? "w-72" : "w-12"}`}>

      <div className="min-h-[calc(100vh-4rem)]">
        <div className="mb-8 grid grid-flow-col justify-end">
          <button className="w-fit text-light-font hover:text-primary-200 bg-grayscale-0 hover:bg-grayscale-0 p-4 heading-md" 
            onClick={() => setCollapse(!collapse)}>
            {collapse ? "<" : ">"}
          </button>
        </div>

        { collapse && (
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
        )}
      </div>

      { collapse && (
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
      )}

    </div>
  );
};

const ProjectNavItem = ({project}: ProjectNavItemProps) => {
  const [showPages, setShowPages] = useState<boolean>(false);
  
  return (
    <>
      <div
        className="bg-dark-blue-200 border-b border-solid border-dark-blue-100 heading-sm px-6 py-3  overflow-auto">
        
        <Link to={project.id.toString()}>
          <button onClick={() => console.log("Open " + project.name)} 
            className="float-left w-5/6 leading-8 m-0 p-0 text-left bg-grayscale-0 hover:bg-grayscale-0 text-light-font">
            {project.name}
          </button>
        </Link>

        <button className="font-light heading-xs m-0 p-0 bg-grayscale-0 hover:bg-grayscale-0 text-light-font hover:text-primary-200 
        w-1/6 float-left leading-8"
        onClick={() => setShowPages(!showPages)}>
          <p className={showPages ? "rotate-180" : "rotate-0"}>V</p>
        </button>

      </div>
            
      {showPages && (
        project.pages.map(page => (
          <Link key={page.id} to={project.id.toString() + "/" + page.id.toString()}>
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