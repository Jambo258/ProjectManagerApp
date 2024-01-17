import { useState } from "react";

interface Member {
  id?: number,
  role: string,
  handleUserRemoval: () => void;
}

// For testing purposes current user's role
// Different things shown to manager and viewer/editor
const userRole = "manager";

// TO DO
// Get name and email
// Change role
// Remove/leave from project

export const ProjectMember = ({ role, handleUserRemoval }: Member) => {
  const [currentRole, setCurrentRole] = useState<string>(role);
  
  const onRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "remove") {
      handleUserRemoval();
    } else {
      // Update users role here
      setCurrentRole(e.target.value);
      console.log("Current role: " + e.target.value);
    }
  };

  return (
    <div className="flex flex-row items-center gap-3">

      <div className="w-8 h-8 btn-text-sm pt-1 text-center text-[white]
      bg-purple-200 rounded-full">
        { /* temporary letter, when there is data for the name, use name[0].toUppercase */ }
        A
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
        {(currentRole === "manager") &&
          <option value="remove" onSelect={() => handleUserRemoval()}
            className="bg-caution-100 btn-text-xs">Remove</option>
        }
      </select>

    </div>
  );
};
