import { useState } from "react";
import { DeleteModal } from "../../components/DeleteModal";
import { Role, useDeleteProjectUserMutation, useEditProjectUserMutation } from "../api/apiSlice";

interface ProjectMemberProps {
  id: number | undefined,
  role: Role,
  projectId: number,
  userRole: Role,
  userId: number
}

// TO DO
// Get name and email
// Change role
// Remove from project

export const ProjectMemberItem = ({ id, role, projectId, userId, userRole }: ProjectMemberProps) => {
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const deleteModalText = "Are you sure you want to remove this user?";

  // Change role
  const [editProjectMember] = useEditProjectUserMutation();

  const onRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "remove") {
      setConfirmDeleteEdit(!confirmDeleteEdit);
    } else {
      try {
        await editProjectMember({userId: id!, projectId: projectId, role: (e.target.value as Role)}).unwrap();
      } catch {
        console.log("Error!");
      }
    }
  };
  
  // Remove user from project
  const [deleteUser] = useDeleteProjectUserMutation();

  const handleSubmitForModal = async () => {
    try {
      await deleteUser({projectId: projectId, userId: id!, role: role}).unwrap();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  return (
    <section className="flex flex-row items-center gap-3">
      <div className="w-8 h-8 btn-text-sm pt-1 text-center text-[white]
      bg-purple-200 rounded-full">
        {id}
      </div>

      <div className="flex-1">
        <p className="body-text-md">Name here</p>
        <p className="body-text-xs">E-mail here</p>
      </div>
      
      <select className="p-2 m-2 btn-text-xs border border-grayscale-300" 
        value={role} 
        onChange={(e) => onRoleChange(e)} disabled={userRole !== "manager" || id === userId}>
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
        />
      )}
    </section>
  );
};
