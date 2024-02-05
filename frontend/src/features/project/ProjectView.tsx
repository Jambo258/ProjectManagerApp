import { Modal } from "../../components/Modal";
import { useGetProjectsQuery } from "../api/apiSlice";
import CreateProjectModal from "./CreateProjectModal";

export const ProjectView = () => {
  const { data: projects = [] } = useGetProjectsQuery();
  
  const handleText = () => {
    if (projects.length === 0) {
      return "It seems like you don't have any projects yet!";
    } else {
      return "Create new project or check one of the existing ones!";
    }
  };

  return (
    <section className="p-4 sm:p-8 max-h-full h-screen max-w-full overflow-auto flex flex-col gap-6 justify-center">
      <p className="mx-auto">{handleText()}</p>
            
      <Modal
        btnText={"Create new project"}
        btnStyling={"btn-text-xs mx-auto w-fit"}
        modalTitle={"Create new page"}>
        <CreateProjectModal />
      </Modal>
    </section>
  );
};
