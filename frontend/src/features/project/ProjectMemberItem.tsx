import { useState } from "react";
import { DeleteModal } from "../../components/DeleteModal";
import { useDeleteProjectUserMutation, useEditProjectUserMutation } from "../api/apiSlice";
import { User } from "react-feather";

interface ProjectMemberProps {
  id: number,
  role: string,
  userRole: string,
  projectId: number
}

// TO DO
// Get name and email -> NEEDS BACKEND CHANGES
// Change role
// Remove from project

export const ProjectMemberItem = ({ id, role, userRole, projectId }: ProjectMemberProps) => {
  const [currentRole, setCurrentRole] = useState<string>(role);
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const deleteModalText = "Are you sure you want to remove this user?";

  const [editProjectMember] = useEditProjectUserMutation();
  
  const onRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "remove") {
      setConfirmDeleteEdit(!confirmDeleteEdit);
    } else {
      try {
        await editProjectMember({userId: id, projectId: projectId, role: currentRole}).unwrap();
        setCurrentRole(e.target.value);
        console.log("Role changed to: " + e.target.value);
      } catch {
        console.log("Error!");
      }
    }
  };
  
  const [deleteUser] = useDeleteProjectUserMutation();

  const handleSubmitForModal = async () => {
    try {
      await deleteUser({projectId: projectId, userId: id, role: role}).unwrap();

    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };


  return (
    <div className="flex flex-row items-center gap-3">

      <div className="w-8 h-8 btn-text-sm pt-1 text-center text-[white]
      bg-purple-200 rounded-full">
        {id}
      </div>

      <div className="flex-1">
        <p className="body-text-md">Name here</p>
        <p className="body-text-xs">E-mail here</p>
      </div>
      
      <select className="p-2 m-2 btn-text-xs border border-grayscale-300" 
        value={currentRole} 
        onChange={(e) => onRoleChange(e)} disabled={userRole !== "manager"}>
        <option value="editor" 
          className="btn-text-xs">Editor</option>
        <option value="viewer" 
          className="btn-text-xs">Viewer</option>
        <option value="manager" 
          className="btn-text-xs">Manager</option>
        {/* Check if user is manager */}
        <option value="remove"
          className="bg-caution-100 btn-text-xs">
            Remove
        </option>
      </select>

      {confirmDeleteEdit && (
        <DeleteModal
          setConfirmDeleteEdit={setConfirmDeleteEdit}
          confirmDeleteEdit={confirmDeleteEdit}
          handleSubmitForModal={handleSubmitForModal}
          deleteModalText={deleteModalText}
        ></DeleteModal>
      )}
    </div>
  );
};
