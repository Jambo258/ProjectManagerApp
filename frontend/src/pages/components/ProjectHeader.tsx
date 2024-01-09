import { Link, NavLink } from "react-router-dom";
import { MoreVertical, Plus } from "react-feather";

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
      <p className="heading-xl mb-2">{project.name}</p>

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

      <button className="heading-lg fixed top-6 right-6 py-0 px-2 bg-grayscale-0 hover:bg-grayscale-0">
        <Link to="/"><MoreVertical size={20} /></Link>
      </button>
    </header>
  );
};
