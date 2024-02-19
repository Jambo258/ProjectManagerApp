// Redux
import { type Member, type Project } from "../api/apiSlice";

// React Router


// Components
import { TaskMember } from "./TaskMemberItem";
import { type Task } from "./Kanban";

interface IProps {
  task: Task;
  addTaskMember: (id: number | string, newMember: Member) => void;
  removeTaskMember: (id: number | string, newMember: Member) => void;
  project: Project | undefined;
}

export const TaskMembersModal = ({ task, addTaskMember, removeTaskMember, project }: IProps ) => {

  return (
    <div className="mx-2">
      <h5 className="heading-xs mb-2">Project members</h5>
      <section>
        {project!.users.map((member: Member) => {
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
