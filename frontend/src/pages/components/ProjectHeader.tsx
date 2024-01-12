import { NavLink } from "react-router-dom";

// Components
import { Menu } from "../../components/Menu";
import { RenameProjectModal } from "../../features/project/RenameProjectModal";
import AddPage from "../../features/Page/AddPage";
import { Modal } from "../../components/Modal";
import { RenameProject } from "../../features/project/RenameProject";

const project = {
  id: 2,
  name: "Group Project",
  pages: [
    {
      id: 21,
      name: "Task Board",
    },
    {
      id: 22,
      name: "To do",
    },
    {
      id: 23,
      name: "Notepad",
    },
  ],
};

export const ProjectHeader = () => {
  return (
    <header className="flex-shrink-0 p-6 border-b border-solid border-grayscale-300 bg-grayscale-100 overflow-x-hidden">

      <section className="flex flex-auto justify-between">
        <h2 className="heading-xl mb-2">{project.name}</h2>
        <Menu>
          {/* ProjectId still a placeholder! */}
          <RenameProjectModal projectId={1} projectName={project.name}/>
          {/* Projectid still a placeholder! */}
          <AddPage projectid={212} buttonSelector={"menu"} />
        </Menu>
      </section>

      <nav className="flex flex-wrap gap-x-2 gap-y-2 body-text-md">
        {project.pages.length > 0 &&
          project.pages.map((page) => (
            <NavLink
              to="/"
              key={page.id}
              className={({ isActive }) =>
                isActive ? "mr-4 underline focus:outline-none" : "mr-4 focus:outline-none"
              }
            >
              {page.name}
            </NavLink>
          ))}
        {/* Projectid still a placeholder! */}
        <AddPage projectid={212} buttonSelector={"plus"} />
        <Modal btnText={"Click Here"} btnStyling={""} modalTitle={"Test"}>
          <RenameProject projectId={1} projectName={project.name} />
        </Modal>
      </nav>
    </header>
  );
};
