import { Link, useParams } from "react-router-dom";

// Components
import { Plus } from "react-feather";
import { Menu } from "../../components/Menu";
import { Modal } from "../../components/Modal";
import { RenameProjectModal } from "./RenameProjectModal";
import { DeleteProjectModal } from "./DeleteProjectModal";
import { AddPageModal } from "../page/AddPageModal";
import { useGetProjectQuery } from "../../features/api/apiSlice";
import { ProjectMembersModal } from "./ProjectMembersModal";
import { useState } from "react";
import { RenamePageModal } from "../page/RenamePageModal";
import { DeletePageModal } from "../page/DeletePageModal";

export const ProjectHeader = () => {
  const [showHeader, setShowHeader] = useState<boolean>(true);

  const projectId = parseInt(useParams().projectId!);
  const pageId = parseInt(useParams().pageId!);
  const { data: project } = useGetProjectQuery(projectId);

  if (!project) {
    return null;
  }

  const activePage = () => {
    const activePage = pageId ? project.pages.find(page => page.id === pageId) : null;
    return (activePage ? activePage.name : "");
  };

  return (
    <header className={`flex-shrink-0 p-6 border-b border-solid border-grayscale-300 bg-grayscale-100 overflow-x-hidden ${showHeader ? "h-fit" : "h-16"}`}>
      <section className="flex flex-auto justify-between">
        {showHeader &&
        <h2 className={`heading-md sm:heading-xl mb-2 pr-8 ${!project.name.includes(" ") && "break-all"}`}>{project.name}</h2>
        }
        <Menu>
          <button className="min-w-max w-full px-2 py-1.5 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
            onClick={() => setShowHeader(!showHeader)}>
            {showHeader ? "Hide header" : "Show header" } 
          </button> 

          <hr className="min-w-full p-0 m-0 border-1 border-grayscale-300" />

          <Modal
            btnText={"Add new page"}
            btnStyling={
              "min-w-max w-full px-2 py-1.5 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
            }
            modalTitle={"Add new page"}>
            <AddPageModal projectId={projectId} />
          </Modal> 

          {pageId ?
            <Modal
              btnText={"Rename page"}
              btnStyling={
                "min-w-max w-full px-2 py-1.5 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
              }
              modalTitle={"Rename page"}
            >
              <RenamePageModal 
                pageId={pageId} 
                pageName={activePage()} />
            </Modal>
            : null
          }

          {pageId ?
            <DeletePageModal
              btnText={"Delete page"}
              btnStyling={
                "min-w-max w-full px-2 py-1.5 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
              }
            />
            : null      
          }

          <hr className="min-w-full p-0 m-0 border-1 border-grayscale-300" />

          <Modal
            btnText={"Rename project"}
            btnStyling={
              "min-w-max w-full px-2 py-1.5 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
            }
            modalTitle={"Rename project"}
          >
            <RenameProjectModal
              projectId={projectId}
              projectName={project.name}
            />
          </Modal>
          <Modal
            btnText={"Project members"}
            btnStyling={
              "min-w-max w-full px-2 py-1.5 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
            }
            modalTitle={"Project members"}
          >
            <ProjectMembersModal projectId={projectId} />
          </Modal>
          <DeleteProjectModal
            btnText={"Delete project"}
            btnStyling={
              "min-w-max w-full px-2 py-1.5 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
            }
          />
        </Menu>
      </section>

      {showHeader &&
      <nav className="flex flex-wrap gap-x-2 gap-y-2 body-text-md">
        {project.pages.length > 0 &&
          project.pages.map((page) => (
            <Link
              to={`/projects/${project.id}/${page.id}`}
              key={page.id}
              className={`mr-4 focus:outline-none ${window.location.pathname.endsWith(`/projects/${project.id}/${page.id}`) && "underline"}`}>
              { window.location.pathname.endsWith(`/projects/${project.id}/${page.id}`) || (page.name.length <= 18)
                ? page.name
                : page.name.slice(0, 15) + ((page.name.length > 15) ? "..." : "")
              }
            </Link>
          ))}

        <Modal
          btnText={<Plus size={16} />}
          btnStyling={"p-1.5 rounded-full heading-md"}
          modalTitle={"Add new page"}>
          <AddPageModal projectId={projectId}/>
        </Modal>
      </nav>
      }
    </header>
  );
};
