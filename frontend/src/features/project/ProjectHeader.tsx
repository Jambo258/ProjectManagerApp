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

export const ProjectHeader = () => {
  const projectid = parseInt(useParams().projectId!);

  const { data: project } = useGetProjectQuery(projectid);

  if (!project) {
    return null;
  }
  return (
    <header className="sticky z-10 top-0 flex-shrink-0 p-6 border-b border-solid border-grayscale-300 bg-grayscale-100 overflow-x-hidden">
      <section className="flex flex-auto justify-between">
        <h2 className="heading-xl mb-2">{project.name}</h2>
        <Menu>
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
            btnStyling={"min-w-max w-full p-1.5 heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"}
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

      <nav className="flex flex-wrap gap-x-2 gap-y-2 body-text-md">
        {project.pages.length > 0 &&
          project.pages.map((page) => (
            <Link
              to={`/projects/${project.id}/${page.id}`}
              key={page.id}
              className={`mr-4 focus:outline-none ${window.location.pathname.includes(`/projects/${project.id}/${page.id}`) && "underline"}`}>
              {page.name}
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
