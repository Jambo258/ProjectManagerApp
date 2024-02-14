// React
import { useState } from "react";

// React Router
import { useNavigate, useParams } from "react-router-dom";

// Redux Toolkit
import { useDeletePageMutation } from "../api/apiSlice";

// Components
import { DeleteModal } from "../../components/DeleteModal";

interface IProps {
  btnText: string;
  btnStyling: string;
}

export const DeletePageModal = ({btnText, btnStyling}: IProps) => {
  const navigate = useNavigate();
  const pageId = parseInt(useParams().pageId!);
  const projectId = parseInt(useParams().projectId!);
  const [deletePage, { isLoading }] = useDeletePageMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const deleteConfirmationTitle = "Are you sure you want to delete current page?";
  const deleteConfirmationTtext = "This page and all it's content will be removed.";

  const openModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeletePage = async () => {
    if (!isLoading && pageId) {
      try {
        const page = await deletePage(pageId).unwrap();
        if (page) {
          closeModal();
          navigate(`/projects/${projectId}`);
        }
      } catch (err) {
        console.error("Failed to delete the page", err);
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
        handleSubmitForModal={handleDeletePage}
        deleteModalTitle={deleteConfirmationTitle}
        deleteModalText={deleteConfirmationTtext} />
      }
    </>

  );
};
