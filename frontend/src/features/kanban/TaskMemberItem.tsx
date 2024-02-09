// React
import { useEffect, useState } from "react";

// Components
import { UserIcon } from "../user/UserIcon";
import { Check, CheckSquare, Square } from "react-feather";

// Types and Interfaces
import { type Member } from "../api/apiSlice";
import { type Task } from "./Kanban";

interface IProps {
  member: Member;
  addTaskMember: (id: number | string, newMember: Member) => void;
  removeTaskMember: (id: number | string, newMember: Member) => void;
  task: Task;
}

export const TaskMember = ({
  member,
  addTaskMember,
  task,
  removeTaskMember,
}: IProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const addMemberToTask = () => {
    addTaskMember(task.Id, member);
  };

  const removeMemberFromTask = () => {
    removeTaskMember(task.Id, member);
  };

  const handleOnClick = () => {
    isChecked ? removeMemberFromTask() : addMemberToTask();
    setIsChecked((prev) => !prev);
  };

  useEffect(() => {
    task.members.forEach((taskMember) => {
      if (taskMember.id === member.id) {
        setIsChecked(true);
      }
    });
  }, [task.members, member.id]);

  return (
    <div
      role="button"
      onClick={handleOnClick}
      className="flex flex-row justify-between items-center mb-2"
    >
      <section className="inline-flex items-center gap-2.5">
        <UserIcon id={member.id} name={member.name} />
        <p className="body-text-sm">{member.name}</p>
      </section>
      <p>{isChecked ? <CheckSquare /> : <Square />}</p>
    </div>
  );
};
