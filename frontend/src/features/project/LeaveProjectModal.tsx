import { useState } from "react";
import { DeleteModal } from "../../components/DeleteModal";

interface RemoveProjectMemberProps {
  handleRemove: () => void;
}

export const LeaveProjectModal = ( { handleRemove }: RemoveProjectMemberProps ) => {
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const deleteModalTitle = "Are you sure you want to leave the project?";

  const deleteModalText = "You can't access the project anymore unless you are invited back by a manager.";

  return (
    <>
      <button
        className="bg-caution-100 hover:bg-caution-200 btn-text-xs p-2"
        onClick={() => {
          setConfirmDeleteEdit(!confirmDeleteEdit);
        }}>
        Leave project
      </button>

      {confirmDeleteEdit && (
        <DeleteModal
          setConfirmDeleteEdit={setConfirmDeleteEdit}
          confirmDeleteEdit={confirmDeleteEdit}
          handleSubmitForModal={handleRemove}
          deleteModalTitle={deleteModalTitle}
          deleteModalText={deleteModalText}
        />
      )}
    </>
  );
};
