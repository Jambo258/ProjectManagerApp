import { useEffect, useState } from "react";

// For testing purposes
interface Member {
  id?: number,
  name: string,
  email: string,
  role: string
}

// For testing purposes
const members: Member[] = [
  {
    id: 1,
    name: "Anni Aatos",
    email: "anni.aatos@mail.com",
    role: "member"
  },
  {
    id: 2,
    name: "Berit Käppänä",
    email: "berit@mail.com",
    role: "manager"
  },
  {
    id: 3,
    name: "Carita Sammal",
    email: "caritasammal@mail.com",
    role: "member"
  }
];    

// For testing purposes
// Current user's role and id
const userRole = "manager";
const userId = 2;

export const ProjectMembersModal = () => {
  return (
    <>
      { (userRole === "manager") &&
      <>
        <div className="flex flex-row gap-2 mb-2">
          <input placeholder="E.g. example@mail.com"
            className="flex-1 p-2 btn-text-xs border border-grayscale-300" />
      
          <select className="p-2 btn-text-xs border border-grayscale-300">
            <option value="Member" 
              className="btn-text-xs">Member</option>
            <option value="Manager" 
              className="btn-text-xs">Manager</option>
          </select> 

          <button type="submit" className="p-2 btn-text-xs">
          Invite
          </button>
        </div>
      
        <p className="body-text-xs text-caution-200">Error here if user doesn&#39;t exist or is already in project.</p>
      </>
      }
      
      
      <h2 className="heading-xs mt-4">Current project members</h2>
      {
        members.map((member: Member) => (
          <ProjectMember 
            key={member.id} id={member.id} name={member.name} email={member.email} role={member.role} />
        )
        )
      }

      <div className="flex flex-row gap-2 items-center pt-4">
        <div className="flex-1 items-center">
          <h3 className="heading-xs">
          Leave project
          </h3>
          <p className="body-text-sm">If you leave project, you can&#39;t return without being invited again by a manager.</p>
        </div>
        <button className="bg-caution-100 hover:bg-caution-200 btn-text-xs p-2">Leave project</button>
      </div>
      
    </>
  );
};

export const ProjectMember = ({ id, name, email, role }: Member) => {
  const [currentRole, setCurrentRole] = useState<string>(role);

  useEffect(() => {
    console.log(currentRole);
  }, [currentRole]);

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
      <div className="p-2">
        <select className="p-2 btn-text-xs border border-grayscale-300" 
          value={currentRole} 
          onChange={(e) => setCurrentRole(e.target.value)} disabled={userRole != "manager"}>
          <option value="Member" 
            className="btn-text-xs">Member</option>
          <option value="Manager" 
            className="btn-text-xs">Manager</option>
          {(id !== userId && userRole === "manager") &&
          <option value="Remove" onSelect={() => console.log("Remove from project")}
            className="bg-caution-100 btn-text-xs">Remove</option>
          }
        </select>
      </div>
    </div>
  );
};
