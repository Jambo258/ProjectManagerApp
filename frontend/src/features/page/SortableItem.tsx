import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { SortablePage } from "./SortablePage";
import { Column, Task } from "./DnDComponent";

interface Props {
  column: Column;
  deleteColumn: (id: string | number) => void;
  createTask: (columnId: string | number) => void;
  tasks: Task[];
  deleteTask: (id: string | number) => void;
}

export const SortableItem = (props: Props) => {
  const { column, deleteColumn, createTask, tasks, deleteTask } = props;

  const taskIds = useMemo(() => {
    return tasks.map((element) => element.Id);
  }, [tasks]);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column.Id,
      data: {
        type: "Column",
        column,
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
      className="bg bg-grayscale-100 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        className="text-md h-[60px] rounded-md flex justify-between"
      >
        {column.title}
        <button onClick={() => deleteColumn(column.Id)}>Delete Column</button>
      </div>
      <div className="flex flex-grow flex-col gap-4">
        <SortableContext items={taskIds}>
          {tasks.map((element) => (
            <SortablePage
              task={element}
              key={element.Id}
              deleteTask={deleteTask}
            />
          ))}
        </SortableContext>
      </div>
      <button onClick={() => createTask(column.Id)}>Add task</button>
    </div>
  );
};
