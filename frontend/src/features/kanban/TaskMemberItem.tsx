// React
import { useEffect, useState, Dispatch, SetStateAction } from "react";

// Components
import { UserIcon } from "../user/UserIcon";
import { Check } from "react-feather";

// Types and Interfaces
import { type Member } from "../api/apiSlice";
import { Task } from "./Kanban";

interface IProps {
  member: Member;
  taskMembers: Member[];
  setTaskMembers: Dispatch<SetStateAction<Member[]>>;
  updateTaskMembers: (id: number | string, members: Member) => void;
  removeTaskMembers: (id: number | string, members: Member) => void;
  task: Task;
}

export const TaskMember = ({ member, taskMembers, setTaskMembers, updateTaskMembers, task, removeTaskMembers }: IProps) => {
  const [isChecked, setIsChecked] = useState(false);
  
  const addTaskMember = () => {
    setTaskMembers([...taskMembers, member]);
    updateTaskMembers(task.Id, member);
  };

  const removeTaskMember = () => {
    const updatedTaskMembers = taskMembers.filter(taskMember => taskMember.id !== member.id);
    setTaskMembers(updatedTaskMembers);
    removeTaskMembers(task.Id, member);
  };

  const handleOnClick = () => {
    isChecked ? removeTaskMember() : addTaskMember();
    setIsChecked((prev) => !prev);
  };

  useEffect(() => {
    const getCurrentTaskMembers = (): boolean => {
      let result = false;
      taskMembers.find(taskMember => {
        if (taskMember.id === member.id) {
          setIsChecked(true);
          result = true;
        } else {
          result = false;
        }
      });
      console.log("Get Current Task Members");
      return result;
    };
    getCurrentTaskMembers();
  }, [taskMembers, member.id]);

  return (
    <div
      role="button"
      onClick={handleOnClick}
      className="flex flex-row justify-between items-center mb-2"
    >
      <section className="inline-flex items-center gap-2.5">
        <UserIcon id={member.id} name={member.name} />
        <p className="body-text-sm">
          {member.name}
        </p>
      </section>
      <p>{isChecked ? <Check className="text-grayscale-400"/> : null}</p>
    </div>
  );
};
