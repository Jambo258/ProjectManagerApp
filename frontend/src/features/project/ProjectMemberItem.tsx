import { useState } from "react";
import { DeleteModal } from "../../components/DeleteModal";
import { Role, useDeleteProjectUserMutation, useEditProjectUserMutation } from "../api/apiSlice";

import { Member } from "./ProjectMembersModal";

interface ProjectMemberProps {
  member: Member,
  projectId: number,
  userRole: Role,
  userId: number
}

export const ProjectMemberItem = ({ member, projectId, userId, userRole }: ProjectMemberProps) => {
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const deleteModalText = "Are you sure you want to remove this user?";

  // Change role
  const [editProjectMember] = useEditProjectUserMutation();

  const onRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "remove") {
      setConfirmDeleteEdit(!confirmDeleteEdit);
    } else {
      try {
        await editProjectMember({userId: member.id, projectId: projectId, role: (e.target.value as Role)}).unwrap();
      } catch {
        console.log("Error!");
      }
    }
  };
  
  // Remove user from project
  const [deleteUser] = useDeleteProjectUserMutation();

  const handleSubmitForModal = async () => {
    try {
      await deleteUser({projectId: projectId, userId: member.id, role: member.role as Role}).unwrap();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  return (
    <section className="flex flex-row items-center gap-3">
      <div className="w-8 h-8 btn-text-sm pt-1 text-center text-[white]
      bg-purple-200 rounded-full">
        {member.name[0].toUpperCase()}
      </div>

      <div className="flex-1">
        <p className="body-text-md">{member.name}</p>
        <p className="body-text-xs">{member.email}</p>
      </div>
      
      <select className="p-2 m-2 btn-text-xs border border-grayscale-300" 
        value={member.role} 
        onChange={(e) => onRoleChange(e)} disabled={userRole !== "manager" || member.id === userId}>
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
