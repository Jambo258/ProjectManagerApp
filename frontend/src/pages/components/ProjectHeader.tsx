import { NavLink } from "react-router-dom";

// Components
import { Plus } from "react-feather";
import { Menu } from "../../components/Menu";
import { RenameProjectModal } from "../../features/project/RenameProjectModal";
import AddPage from "../../features/Page/AddPage";

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
          <RenameProjectModal />
          <section className="py-1 ps-1 pe-4">Temp content</section>
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
                isActive ? "underline mr-4" : "mr-4"
              }
            >
              {page.name}
            </NavLink>
          ))}
        {/* Projectid still a placeholder! */}
        <AddPage projectid={212} buttonSelector={"plus"} />
      </nav>
    </header>
  );
};
