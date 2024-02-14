import { useState } from "react";
import { DeleteModal } from "../../components/DeleteModal";
import { useDeleteProjectUserMutation, useEditProjectUserMutation } from "../api/apiSlice";

import { type Member } from "../api/apiSlice";
import { UserIcon } from "../user/UserIcon";

interface ProjectMemberProps {
  member: Member,
  projectId: number,
  userRole: string,
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
        await editProjectMember({userId: member.id, projectId: projectId, role: (e.target.value)}).unwrap();
      } catch {
        console.error("Error!");
      }
    }
  };
  
  // Remove user from project
  const [deleteUser] = useDeleteProjectUserMutation();

  const handleSubmitForModal = async () => {
    try {
      await deleteUser({projectId: projectId, userId: member.id, role: member.role}).unwrap();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  return (
    <section className="grid grid-flow-rows sm:grid-flow-col grid-rows-2 sm:grid-rows-1 grid-cols-4 items-center w-full">
      <div className="row-span-1 sm:row-span-0 col-span-4 sm:col-span-3 w-full">
        <div className="flex flex-row items-center gap-3 max-w-full">
          <section>
            <UserIcon name={member.name} id={member.id} />
          </section>
          <section className="max-w-full break-all">
            <p className="body-text-md">{member.name}</p>
            <p className="body-text-sm">{member.email}</p>
          </section>
        </div>
      </div>
      
      <select className="col-span-4 sm:col-span-1 p-2 my-2 btn-text-xs border border-grayscale-300" 
        value={member.role} 
        onChange={(e) => onRoleChange(e)} disabled={userRole !== "manager" || member.id === userId}>
        <option value="viewer" 
          className="btn-text-xs">Viewer</option>
        <option value="editor" 
          className="btn-text-xs">Editor</option>
        <option value="manager" 
          className="btn-text-xs">Manager</option>
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
