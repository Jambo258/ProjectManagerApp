import { NavLink, useParams } from "react-router-dom";

// Components
import { Menu } from "../../components/Menu";
import { RenameProjectModal } from "./RenameProjectModal";
import AddPage from "../page/AddPage";
import { Modal } from "../../components/Modal";
import { useGetProjectQuery } from "../../features/api/apiSlice";
import { ProjectMembersModal } from "./ProjectMembersModal";

export const ProjectHeader = () => {
  const projectid = parseInt(useParams().projectId!);

  const { data: project } = useGetProjectQuery(projectid);

  if (!project) {
    return null;
  }
  return (
    <header className="flex-shrink-0 p-6 border-b border-solid border-grayscale-300 bg-grayscale-100 overflow-x-hidden">
      <section className="flex flex-auto justify-between">
        <h2 className="heading-xl mb-2">{project.name}</h2>
        <Menu>
          <Modal
            btnText={"Rename project"}
            btnStyling={"min-w-max w-full p-1.5 pe-4 heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"}
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
          
          <AddPage projectid={projectid} buttonSelector={"menu"} />
        </Menu>
      </section>

      <nav className="flex flex-wrap gap-x-2 gap-y-2 body-text-md">
        {project.pages.length > 0 &&
          project.pages.map((page) => (
            <NavLink
              to={`/projects/${project.id}/${page.id}`}
              key={page.id}
              className={({ isActive }) =>
                isActive
                  ? "mr-4 underline focus:outline-none"
                  : "mr-4 focus:outline-none"
              }
            >
              {page.name}
            </NavLink>
          ))}

        <AddPage projectid={projectid} buttonSelector={"plus"} />
      </nav>
    </header>
  );
};
