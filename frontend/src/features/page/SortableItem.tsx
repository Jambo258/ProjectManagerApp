import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { SortableItemContent } from "./SortableItemContent";
import { Column, Task } from "./DnDComponent";
import { TaskModal } from "./TaskModal";

interface Props {
  column: Column;
  deleteColumn: (id: string | number) => void;
  updateColumn: (id: string | number, title: string) => void;
  createTask: (columnId: string | number) => void;
  tasks: Task[];
  deleteTask: (id: string | number) => void;
  updateTask: (id: string | number, content: string) => void;
  updateTaskTitle: (id: string | number, title: string) => void;
  markTaskDone: (id: string | number) => void;
}

export const SortableItem = (props: Props) => {
  const {
    column,
    deleteColumn,
    createTask,
    tasks,
    deleteTask,
    updateColumn,
    updateTask,
    updateTaskTitle,
    markTaskDone,
  } = props;

  const [edit, setEdit] = useState(false);

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
      className="bg bg-grayscale-200 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        className=" bg bg-primary-100 text-md h-[60px] max-h-[60px] min-h-[60px] rounded-md flex justify-between items-center text-center mb-4"
        // onClick={() => setEdit(true)}
      >
        {!edit && (
          <div onClick={() => setEdit(true)} className="ml-4">
            {column.title}
          </div>
        )}
        {edit && (
          <input
            className="w-36 text-sm bg bg-primary-200 rounded-md"
            autoFocus
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEdit(false);
            }}
            onBlur={() => setEdit(false)}
            value={column.title}
            onChange={(e) => updateColumn(column.Id, e.target.value)}
          ></input>
        )}
        <TaskModal>
          <div onClick={() => deleteColumn(column.Id)}>Delete</div>
          <div></div>
        </TaskModal>
      </div>
      <div className="flex flex-grow flex-col gap-4">
        <SortableContext items={taskIds}>
          {tasks.map((element) => (
            <SortableItemContent
              task={element}
              key={element.Id}
              deleteTask={deleteTask}
              updateTask={updateTask}
              updateTaskTitle={updateTaskTitle}
              markTaskDone={markTaskDone}
            />
          ))}
        </SortableContext>
      </div>
      <button className="mt-4" onClick={() => createTask(column.Id)}>
        Add task
      </button>
    </div>
  );
};
