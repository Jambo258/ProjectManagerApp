import { NavLink, useParams } from "react-router-dom";

// Components
import { Menu } from "../../components/Menu";
import { RenameProjectModal } from "../../features/project/RenameProjectModal";
import AddPage from "../../features/Page/AddPage";
import { Modal } from "../../components/Modal";
import { useGetProjectPageQuery } from "../../features/api/apiSlice";

export const ProjectHeader = () => {
  const pageid = parseInt(useParams().pageId!);

  const { data: project } = useGetProjectPageQuery(pageid);

  if (!project) return null;
  return (
    <header className="flex-shrink-0 p-6 border-b border-solid border-grayscale-300 bg-grayscale-100 overflow-x-hidden">
      <section className="flex flex-auto justify-between">
        <h2 className="heading-xl mb-2">{project.name}</h2>
        <Menu>
          {/* ProjectId still a placeholder! */}
          <Modal
            btnText={"Rename project"}
            btnStyling={
              "min-w-max w-full p-1.5 pe-4 heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
            }
            modalTitle={"Rename project"}
          >
            <RenameProjectModal
              projectId={project.projectid}
              projectName={project.name}
            />
          </Modal>
          {/* Projectid still a placeholder! */}
          <AddPage projectid={project.projectid} buttonSelector={"menu"} />
        </Menu>
      </section>

      <nav className="flex flex-wrap gap-x-2 gap-y-2 body-text-md">
        {project.pages.length > 0 &&
          project.pages.map((page) => (
            <NavLink
              to="/"
              key={page.id}
              className={({ isActive }) =>
                isActive
                  ? "mr-4 underline focus:outline-none"
                  : "mr-4 focus:outline-none"
              }
            >
              {project.name}
            </NavLink>
          ))}
        {/* Projectid still a placeholder! */}
        <AddPage projectid={project.projectid} buttonSelector={"plus"} />
      </nav>
    </header>
  );
};
