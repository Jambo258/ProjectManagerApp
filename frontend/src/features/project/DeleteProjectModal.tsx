// React
import { useState } from "react";

// React Router
import { useNavigate, useParams } from "react-router-dom";

// Redux Toolkit
import { useDeleteProjectMutation } from "../api/apiSlice";

// Components
import { DeleteModal } from "../../components/DeleteModal";

interface IProps {
  btnText: string;
  btnStyling: string;
}

export const DeleteProjectModal = ({btnText, btnStyling}: IProps) => {
  const navigate = useNavigate();
  const projectId = Number(useParams().projectId!);
  const [deleteProject, { isLoading }] = useDeleteProjectMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const deleteConfirmationTitle = "Are you sure you want to delete this project?";
  const deleteConfirmationTtext = "All of the resources in this project will be removed permanently from all the project members.";

  const openModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteProject = async () => {
    if (!isLoading) {
      try {
        const project = await deleteProject(projectId).unwrap();
        if (project) {
          closeModal();
          navigate("..", { relative: "path" });
          navigate(0);
        }
      } catch (err) {
        console.error("Failed to delete the project", err);
        // TO DO: Refactor this
        if (
          err &&
          typeof err === "object" &&
          "data" in err &&
          err.data &&
          typeof err.data === "object"
        ) {
          const errorMessage = Object.values(err.data);
          console.error(errorMessage);
        }
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={btnStyling}>
        { btnText }
      </button>

      {isDeleteModalOpen &&
      <DeleteModal
        setConfirmDeleteEdit={setIsDeleteModalOpen}
        confirmDeleteEdit={isDeleteModalOpen}
        handleSubmitForModal={handleDeleteProject}
        deleteModalTitle={deleteConfirmationTitle}
        deleteModalText={deleteConfirmationTtext} />
      }
    </>

  );
};
