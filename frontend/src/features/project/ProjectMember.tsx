import { useState } from "react";

interface Member {
  id?: number,
  name: string,
  email: string,
  role: string
}

// For testing purposes
// Current user's id and role
// Different things shown to manager and member
const userId = 2;
const userRole = "manager";

export const ProjectMember = ({ id, name, email, role }: Member) => {
  const [currentRole, setCurrentRole] = useState<string>(role);

  
  const onRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "remove") {
      removeUser();
    } else {
      // Update users changed role here
      setCurrentRole(e.target.value);
      console.log("Current role: " + e.target.value);
    }
  };

  // Remove user from project
  const removeUser = () => {
    // Remove user from project's members here
    console.log("Remove user");
  };

  return (
    <div className="flex flex-row items-center gap-3">

      <div className="w-8 h-8 btn-text-sm pt-1 text-center text-[white]
      bg-purple-200 rounded-full">
        {name[0].toUpperCase()}
      </div>

      <div className="flex-1">
        <p className="body-text-md">{name}</p>
        <p className="body-text-xs">{email}</p>
      </div>

      <select className="p-2 m-2 btn-text-xs border border-grayscale-300" 
        value={currentRole} 
        onChange={(e) => onRoleChange(e)} disabled={userRole != "manager"}>
        <option value="editor" 
          className="btn-text-xs">Editor</option>
        <option value="viewer" 
          className="btn-text-xs">Viewer</option>
        <option value="manager" 
          className="btn-text-xs">Manager</option>
        {(id !== userId && userRole === "manager") &&
          <option value="remove" onSelect={() => removeUser()}
            className="bg-caution-100 btn-text-xs">Remove</option>
        }
      </select>

    </div>
  );
};
