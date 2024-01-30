import { Link, useParams } from "react-router-dom";

// Components
import { Plus } from "react-feather";
import { Menu } from "../../components/Menu";
import { Modal } from "../../components/Modal";
import { RenameProjectModal } from "./RenameProjectModal";
import { DeleteProjectModal } from "./DeleteProjectModal";
import AddPage from "../page/AddPage";
import { useGetProjectQuery } from "../../features/api/apiSlice";
import { ProjectMembersModal } from "./ProjectMembersModal";
import { useState } from "react";

export const ProjectHeader = () => {
  const [showHeader, setShowHeader] = useState<boolean>(true);

  const projectid = parseInt(useParams().projectId!);
  const { data: project } = useGetProjectQuery(projectid);

  if (!project) {
    return null;
  }

  return (
    <header className={`flex-shrink-0 p-6 border-b border-solid border-grayscale-300 bg-grayscale-100 overflow-x-hidden ${showHeader ? "h-fit" : "h-16"}`}>
      <section className="flex flex-auto justify-between">
        <h2 className={`heading-md sm:heading-xl mb-2 pr-8 ${!project.name.includes(" ") && "break-all"} ${showHeader ? "visible" : "hidden"}`}>{project.name}</h2>
        <Menu>
          <button className="min-w-max w-full p-1.5 pe-4 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
            onClick={() => setShowHeader(!showHeader)}>
            {showHeader ? "Hide header" : "Show header" } 
          </button> 
          <Modal
            btnText={"Add page"}
            btnStyling={
              "min-w-max w-full p-1.5 pe-4 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
            }
            modalTitle={"Add new page"}>
            <AddPage projectId={projectid} />
          </Modal>
          <Modal
            btnText={"Rename project"}
            btnStyling={
              "min-w-max w-full p-1.5 pe-4 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
            }
            modalTitle={"Rename project"}
          >
            <RenameProjectModal
              projectId={projectid}
              projectName={project.name}
            />
          </Modal>
          <Modal
            btnText={"Project members"}
            btnStyling={
              "min-w-max w-full p-1.5 pe-4 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
            }
            modalTitle={"Project members"}
          >
            <ProjectMembersModal projectId={projectid} />
          </Modal>
          <DeleteProjectModal
            btnText={"Delete project"}
            btnStyling={
              "min-w-max w-full p-1.5 pe-4 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
            }
          />
        </Menu>
      </section>

      <nav className={`flex flex-wrap gap-x-2 gap-y-2 body-text-md ${showHeader ? "visible" : "hidden"}`}>
        {project.pages.length > 0 &&
          project.pages.map((page) => (
            <Link
              to={`/projects/${project.id}/${page.id}`}
              key={page.id}
              className={`mr-4 focus:outline-none ${window.location.pathname.includes(`/projects/${project.id}/${page.id}`) && "underline"}`}>
              { window.location.pathname.includes(`/projects/${project.id}/${page.id}`) || (page.name.length <= 13)
                ? page.name
                : page.name.slice(0, 10) + ((page.name.length > 10) ? "..." : "")
              }
            </Link>
          ))}

        <Modal
          btnText={<Plus size={16} />}
          btnStyling={"p-1.5 rounded-full heading-md"}
          modalTitle={"Add new page"}>
          <AddPage projectId={projectid}/>
        </Modal>
      </nav>
    </header>
  );
};
