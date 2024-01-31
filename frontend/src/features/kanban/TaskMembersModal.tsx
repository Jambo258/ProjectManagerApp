// Redux
import { type Member, useGetProjectQuery } from "../api/apiSlice";

// React Router
import { useParams } from "react-router-dom";

// Components
import { UserIcon } from "../user/UserIcon";

export const TaskMembersModal = () => {

  const projectId = parseInt(useParams().projectId!);
  const { data: project } = useGetProjectQuery(projectId);
  console.log(project?.users);

  return (
    <>
      <h5 className="heading-xs mb-2">Project members</h5>
      <ul>
        {project?.users.map((member: Member,) => {
          return <div key={member.id} className="flex flex-row items-center gap-2 mb-2">
            <UserIcon id={member.id} name={member.name} />
            <p className="body-text-sm">{member.name}</p>
          </div>;
        })}
      </ul>
    </>
  );
};
