import { Link } from "react-router-dom";
import { MoreVertical, Plus } from "react-feather";

const project = {
  id: 1,
  name: "Group Project",
  pages: [
    {
      id: 11,
      name: "To Do"
    },
    {
      id: 12,
      name: "Notes"
    }
  ]
};

export const ProjectHeader = () => {
  return (
    <div className="border-b-2 border-solid border-grayscale-300 p-6 relative overflow-x-hidden">
      <p className="heading-xl mb-2">{project.name}</p>

      <div className="flex flex-wrap gap-x-2 gap-y-2 body-text-md">
        {project.pages.length > 0 && project.pages.map(page => (
          <Link to="/" key={page.id} className={`mx-1 + ${({ isActive }) => isActive ? "underline" : ""}`}>
            {page.name}
          </Link>
        ))}
        <button className="rounded-full p-1.5 heading-md" onClick={() => console.log("Add new page")}>
          <Plus size={16} />
        </button>
      </div>

      <button className="heading-lg fixed top-6 right-6 py-0 px-2 bg-grayscale-0 hover:bg-grayscale-0">
        <Link to="/"><MoreVertical size={20} /></Link>
      </button>
    </div>
  );
};
