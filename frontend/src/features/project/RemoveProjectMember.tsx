import { useState } from "react";
import { DeleteModal } from "../../components/DeleteModal";

interface RemoveProjectMemberProps {
  userId: number
}

export const RemoveProjectMember = ( { userId }: RemoveProjectMemberProps ) => {
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const deleteModalText = "Are you sure you want to leave the project?";
  // Add extra mention to deleteTextModal if only manager is leaving
  // Or last member is leaving (project will be deleted)

  const handleSubmitForModal = () => {
    try {
      // const user = await deleteUser().unwrap();
      console.log("User removed: " + userId);

    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

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
          handleSubmitForModal={handleSubmitForModal}
          deleteModalText={deleteModalText}
        ></DeleteModal>
      )}
    </>
  );
};
