import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useGetProjectQuery } from "../api/apiSlice";

import { Modal } from "../../components/Modal";
import { AddPageModal } from "../page/AddPageModal";

export const ProjectTemplate = () => {
  const user = useAppSelector((state) => state.auth.user);
  
  const projectId = parseInt(useParams().projectId!);
  const project = useGetProjectQuery(projectId);

  const handleView = () => {
    if (user && project.data && project.data.pages.length > 0) {
      return "Add new page or check one of the existing ones!";
    } else {
      return "It seems like you don't have any pages yet!";
    }
  };

  return (
    <section className="p-4 sm:p-8 max-h-full h-screen max-w-full overflow-auto flex flex-col gap-6 justify-center">
      <p className="mx-auto">{handleView()}</p> 
      
      <Modal
        btnText={"Add new page"}
        btnStyling={"btn-text-xs mx-auto w-fit"}
        modalTitle={"Add new page"}>
        <AddPageModal projectId={projectId}/>
      </Modal>
    </section>
  );
};
