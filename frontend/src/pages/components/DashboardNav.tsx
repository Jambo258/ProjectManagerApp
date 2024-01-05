import { useState } from "react";

// For mockup purposes
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
    "name": "Group project",
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

export const DashboardNav = () => {
  const [collapse, setCollapse] = useState<boolean>(true);
  const [showPages, setShowPages] = useState<boolean>(true);
 
  return (
    <div className={collapse ? "w-72" : "w-12"}>
      <div className="bg-dark-blue-300 min-h-screen text-light-font">

        <div className="min-h-[calc(100vh-4rem)]">
          
          <div className="h-20 heading-md text-light-font grid grid-flow-col justify-end">
            <p className="cursor-pointer w-fit px-4" onClick={() => setCollapse(!collapse)}>
              {collapse ? "<" : ">"}
            </p>
          </div>

          { collapse && (
            <>
              <div className="px-6 mb-6 heading-md">
            Project <br /> Management App
              </div>

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
                  <div
                    className="bg-dark-blue-200 border-b border-solid border-dark-blue-100 heading-sm px-6 py-3 grid grid-flow-col items-center cursor-pointer">
                    <div onClick={() => console.log("Open " + project.name)}>
                      {project.name}
                    </div>
                    <div className="font-light heading-xs"
                      onClick={() => setShowPages(!showPages)}>
                      <p className={showPages ? "rotate-180" : "rotate-0 float-right"}>V</p>
                    </div>
                  </div>
            
                  {showPages && (
                    project.pages.map(page => (
                      <div key={page.id} 
                        onClick={() => console.log("Open " + page.name)}
                        className="border-b border-solid border-dark-blue-100 body-text-md heading-sm px-6 py-3 hover:bg-dark-blue-100 cursor-pointer">
                        {page.name}
                      </div>
                    ))
                  )}
                </div>
              )
              }
            </>
          )}
        </div>

        <div className="px-4 py-2 grid grid-flow-col items-center bg-dark-blue-100 w-full h-16">
          <div className="rounded-full w-8 h-8 bg-purple-200 text-center heading-sm leading-8 cursor-pointer">
            A
          </div>
          <div>
            <div className="w-fit p-2 float-right" onClick={() => console.log("Log out")}>
            Log out
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
