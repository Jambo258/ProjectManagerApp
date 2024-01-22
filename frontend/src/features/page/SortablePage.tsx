import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./DnDComponent";

interface Props {
  task: Task;
  deleteTask: (id: number | string) => void;
}

export const SortablePage = ({ task, deleteTask }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.Id,
      data: {
        type: "Task",
        task,
      },
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 h-[100px] min-h-[100px] flex justify-between border border-dark-blue-300"
    >
      {task.content}
      <button onClick={() => deleteTask(task.Id)}>Delete task</button>
    </div>
  );
};
