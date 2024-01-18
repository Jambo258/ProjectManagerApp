import { useState } from "react";
import { DeleteModal } from "../../components/DeleteModal";

interface IProps {
    btnText: string;
    btnStyling: string;
  }

export const DeleteProjectModal = ({btnText, btnStyling}: IProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const deleteConfirmationTitle = "Are you sure you want to delete this project?";
  const deleteConfirmationTtext = "All of the resources in this project will be removed permanently from all the project members.";

  const openModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProject = () => {
    console.log("project deleted");
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
        deleteModalText={deleteConfirmationTtext}
      ></DeleteModal>
      }
    </>

  );
};
