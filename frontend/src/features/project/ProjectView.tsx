import { Link } from "react-router-dom";
import { useGetProjectsQuery } from "../api/apiSlice";

import { Modal } from "../../components/Modal";
import CreateProjectModal from "./CreateProjectModal";

export const ProjectView = () => {
  const { data: projects = [] } = useGetProjectsQuery();
  
  const handleText = () => {
    if (projects.length > 0) {
      return "Check one of your existing projects";
    } else {
      return "It seems like you don't have any projects yet!";
    }
  };

  return (
    <section className="p-4 pt-14 sm:pt-4 sm:p-8 max-h-full h-screen max-w-full overflow-auto flex flex-col gap-4 sm:justify-center">
      <p className={"mx-auto"}>{handleText()}</p>

      {projects.length > 0 && 
      <>
        <ul className="w-fit mx-auto">
          {projects.map(project => 
            <li key={project.id} className={"w-full text-center underline body-text-sm my-2 " + ((project.name.length > 15) && "break-all")}><Link to={`/projects/${project.id}`}>{project.name}</Link></li>)}
        </ul>

        <p className="mx-auto mb-2">or</p>
      </>
      }
            
      <Modal
        btnText={"Create new project"}
        btnStyling={"btn-text-xs mx-auto w-fit py-2"}
        modalTitle={"Create new page"}>
        <CreateProjectModal />
      </Modal>

    </section>
  );
};
