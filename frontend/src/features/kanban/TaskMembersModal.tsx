// React

// Redux
import { type Member, useGetProjectQuery } from "../api/apiSlice";

// React Router
import { useParams } from "react-router-dom";

// Components
import { TaskMember } from "./TaskMemberItem";
import { type Task } from "./Kanban";

interface IProps {
  task: Task;
  addTaskMember: (id: number | string, newMember: Member) => void;
  removeTaskMember: (id: number | string, newMember: Member) => void;
}

export const TaskMembersModal = ({ task, addTaskMember, removeTaskMember }: IProps ) => {

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
              addTaskMember={addTaskMember}
              removeTaskMember={removeTaskMember}
              task={task}
            />
          );
        })}
      </section>
    </div>
  );
};
