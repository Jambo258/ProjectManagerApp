import { useState } from "react";
import { DeleteModal } from "../../components/DeleteModal";

export const RemoveProjectMember = () => {
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const deleteModalText = "Are you sure you want to leave the project?";

  const handleSubmitForModal = () => {
    try {
      // const user = await deleteUser().unwrap();
      console.log("User removed");

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
