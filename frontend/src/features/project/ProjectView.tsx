import { useAppSelector } from "../../app/hooks";
import { Modal } from "../../components/Modal";
import { useGetProjectsQuery } from "../api/apiSlice";
import CreateProjectModal from "./CreateProjectModal";

export const ProjectView = () => {
  const user = useAppSelector((state) => state.auth.user);
  const projects = useGetProjectsQuery(user.id);
  
  console.log(projects.data);
  
  const handleView = () => {
    if (user && projects.data?.[0]) {
      return "Create new project or check one of the existing ones!";
    } else {
      return "It seems like you don't have any projects yet!";
    }
  };

  return (
    <section className="p-4 sm:p-8 max-h-full h-screen max-w-full overflow-auto flex flex-col gap-6 justify-center">
      <p className="mx-auto">{handleView()}</p>
            
      <Modal
        btnText={"Create new project"}
        btnStyling={"btn-text-xs mx-auto w-fit"}
        modalTitle={"Create new page"}>
        <CreateProjectModal />
      </Modal>
    </section>
  );
};
