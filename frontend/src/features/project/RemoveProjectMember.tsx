import { useState } from "react";
import { DeleteModal } from "../../components/DeleteModal";

interface RemoveProjectMemberProps {
  handleRemove: () => void
}

export const RemoveProjectMember = ( { handleRemove }: RemoveProjectMemberProps ) => {
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const deleteModalText = "Are you sure you want to leave the project?";
  // Add extra mention to deleteTextModal if only manager is leaving
  // Or last member is leaving (project will be deleted)

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
          deleteModalText={deleteModalText}
        ></DeleteModal>
      )}
    </>
  );
};
