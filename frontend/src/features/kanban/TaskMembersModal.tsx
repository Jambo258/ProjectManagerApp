// React
import { type Dispatch,type SetStateAction } from "react";

// Redux
import { type Member, useGetProjectQuery } from "../api/apiSlice";

// React Router
import { useParams } from "react-router-dom";

// Components
import { TaskMember } from "./TaskMemberItem";
import { Task } from "./Kanban";

interface IProps {
  taskMembers: Member[];
  setTaskMembers: Dispatch<SetStateAction<Member[]>>;
  task: Task;
  updateTaskMembers: (id: number | string, members: Member) => void;
  removeTaskMembers: (id: number | string, members: Member) => void;
}

export const TaskMembersModal = ({ taskMembers, setTaskMembers, task, updateTaskMembers, removeTaskMembers }: IProps ) => {

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
              taskMembers={taskMembers}
              setTaskMembers={setTaskMembers}
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
