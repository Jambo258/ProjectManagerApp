import { NavLink } from "react-router-dom";
import { Plus } from "react-feather";

// Components
import { Menu } from "../../components/Menu";
import { RenameProjectModal } from "../../features/project/RenameProjectModal";

const project = {
  id: 2,
  name: "Group Project",
  pages: [
    {
      id: 21,
      name: "Task Board"
    },
    {
      id: 22,
      name: "To do"
    }
    ,
    {
      id: 23,
      name: "Notepad"
    }
  ]
};

export const ProjectHeader = () => {
  return (
    <header className="border-b border-solid border-grayscale-300 p-6 relative overflow-x-hidden bg-grayscale-100">

      <section className="flex flex-auto justify-between">
        <h2 className="heading-xl mb-2">{project.name}</h2>
        <Menu>
          <RenameProjectModal />
          <section className="py-1 ps-1 pe-4">Temp content</section>
        </Menu>
      </section>

      <nav className="flex flex-wrap gap-x-2 gap-y-2 body-text-md">
        {project.pages.length > 0 && project.pages.map(page => (
          <NavLink to="/" key={page.id}
            className={({ isActive }) => (isActive ? "underline mr-4" : "mr-4")}>
            {page.name}
          </NavLink>
        ))}
        <button className="rounded-full p-1.5 heading-md" onClick={() => console.log("Add new page")}>
          <Plus size={16} />
        </button>
      </nav>

    </header>
  );
};
