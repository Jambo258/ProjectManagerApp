// React

// Redux
import { type Member, useGetProjectQuery } from "../api/apiSlice";

// React Router
import { useParams } from "react-router-dom";

// Components
import { TaskMember } from "./TaskMemberItem";
import { Task } from "./Kanban";

interface IProps {
  task: Task;
  updateTaskMembers: (id: number | string, newMember: Member) => void;
  removeTaskMembers: (id: number | string, newMember: Member) => void;
}

export const TaskMembersModal = ({ task, updateTaskMembers, removeTaskMembers }: IProps ) => {

  const projectId = parseInt(useParams().projectId!);
  const { data: project } = useGetProjectQuery(projectId);
  console.log(project?.users);

  return (
    <div className="mx-2">
      <h5 className="heading-xs mb-2">Project members</h5>
      <section>
        {project!.users.map((member: Member,) => {
          return (
            <TaskMember
              key={member.id}
              member={member}
              updateTaskMembers={updateTaskMembers}
              removeTaskMembers={removeTaskMembers}
              task={task}
            />
          );
        })}
      </section>
    </div>
  );
};
