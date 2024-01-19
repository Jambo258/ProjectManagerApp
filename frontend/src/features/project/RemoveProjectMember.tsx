import { useState } from "react";
import { DeleteModal } from "../../components/DeleteModal";

interface RemoveProjectMemberProps {
  handleRemove: () => void;
  userRole: string;
  projectSize: number
}

export const RemoveProjectMember = ( { handleRemove, userRole, projectSize }: RemoveProjectMemberProps ) => {
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const deleteModalTitle = "Are you sure you want to leave the project?";
  const handleDeleteModalText = () => {
    if (userRole === "manager" && projectSize > 1) {
      return "Project will be left without a manager. You can give someone manager role before leaving.";
    } else if (projectSize === 1) {
      return "Project will be deleted as there will be no members left.";
    } else {
      return "You can't access the project anymore unless you are invited back by a manager.";
    }
  };

  const deleteModalText = handleDeleteModalText();

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
