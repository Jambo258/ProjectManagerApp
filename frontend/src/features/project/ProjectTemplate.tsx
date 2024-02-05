import { Link, useParams } from "react-router-dom";
import { useGetProjectQuery } from "../api/apiSlice";

import { Modal } from "../../components/Modal";
import { AddPageModal } from "../page/AddPageModal";

export const ProjectTemplate = () => {
  const projectId = parseInt(useParams().projectId!);
  const project = useGetProjectQuery(projectId);

  const handleText = () => {
    if (project.data && project.data.pages.length > 0) {
      return "Check one of your existing pages";
    } else {
      return "It seems like you don't have any pages yet!";
    }
  };

  return (
    <section className="flex flex-col gap-4 p-4 sm:p-8 max-h-full h-screen max-w-full overflow-auto sm:justify-center">
      <p className="mx-auto">{handleText()}</p>
      
      {(project.data && (project.data?.pages.length > 0)) &&
      <>
        <ul className="w-fit mx-auto">
          {project.data.pages.map(page => 
            <li key={page.id} 
              className={"w-full text-center underline body-text-sm my-2 " + ((page.name.length > 15) && "break-all")}>
              <Link to={`/projects/${projectId}/${page.id}`}
                className="focus:text-caution-100 focus:outline-none">
                {page.name}
              </Link>
            </li>)}
        </ul>

        <p className="mx-auto mb-3">or</p>
      </>
      }
      
      <Modal
        btnText={"Add new page"}
        btnStyling={"btn-text-xs mx-auto w-fit"}
        modalTitle={"Add new page"}>
        <AddPageModal projectId={projectId}/>
      </Modal>
    </section>
  );
};
