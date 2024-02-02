// React
import { type Dispatch,type SetStateAction } from "react";

// Redux
import { type Member, useGetProjectQuery } from "../api/apiSlice";

// React Router
import { useParams } from "react-router-dom";

// Components
import { TaskMember } from "./TaskMemberItem";

interface IProps {
  taskMembers: Member[];
  setTaskMembers: Dispatch<SetStateAction<Member[]>>;
}

export const TaskMembersModal = ({ taskMembers, setTaskMembers }: IProps ) => {
  const projectId = parseInt(useParams().projectId!);
  const { data: project } = useGetProjectQuery(projectId);

  return (
    <div className="mx-2">
      <h5 className="heading-xs mb-2">Project members</h5>
      <section>
        {project!.users.map((member: Member,) => {
          return (
            <TaskMember
              key={member.id}
              member={member}
              taskMembers={taskMembers}
              setTaskMembers={setTaskMembers}
            />);
        })}
      </section>
    </div>
  );
};
