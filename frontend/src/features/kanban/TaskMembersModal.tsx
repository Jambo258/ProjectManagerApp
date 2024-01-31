// React
import { type Dispatch,type SetStateAction } from "react";

// Redux
import { type Member, useGetProjectQuery } from "../api/apiSlice";

// React Router
import { useParams } from "react-router-dom";

// Components
import { UserIcon } from "../user/UserIcon";

interface IProps {
  taskMembers: Member[];
  setTaskMembers: Dispatch<SetStateAction<Member[]>>;
}

export const TaskMembersModal = ({ taskMembers, setTaskMembers }: IProps ) => {

  const projectId = parseInt(useParams().projectId!);
  const { data: project } = useGetProjectQuery(projectId);
  console.log(project?.users);

  return (
    <>
      <h5 className="heading-xs mb-2">Project members</h5>
      <ul>
        {project!.users.map((member: Member,) => {
          return <div
            key={member.id}
            role="button"
            // TO DO
            // Compare to already selected members. If member is selected clicking will remove the member from the task
            // Save selected members to the task object
            onClick={() => setTaskMembers([...taskMembers, member])}
            className="flex flex-row items-center gap-2 mb-2"
          >
            <UserIcon id={member.id} name={member.name} />
            <p className="body-text-sm">{member.name}</p>
          </div>;
        })}
      </ul>
    </>
  );
};
