import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { KanbanTask } from "./KanbanTask";
import { Column, Labels, Task } from "./Kanban";
import { TaskModal } from "./TaskModal";
import { Plus } from "react-feather";
import { type Member } from "../api/apiSlice";

interface Props {
  removeTaskDeadline: (id: string | number) => void;
  setTaskDeadline: (
    id: string | number,
    deadline: number | object | undefined
  ) => void;
  column: Column;
  deleteColumn: (id: string | number) => void;
  updateColumn: (id: string | number, title: string) => void;
  createTask: (columnId: string | number) => void;
  tasks: Task[];
  deleteTask: (id: string | number) => void;
  updateTask: (id: string | number, content: string) => void;
  updateTaskTitle: (id: string | number, title: string) => void;
  markTaskDone: (id: string | number) => void;
  labels: Labels[];
  labelColors: Labels[];
  setIsModalsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalsOpen: boolean;
  createLabel: (name: string, color: string) => void;
  updateLabelStatus: (taskId: string, id: string) => void;
  deleteLabelStatus: (taskId: string, id: string) => void;
  editLabel: (id: string | number, name: string, color: string) => void;
  deleteLabel: (id: string | number) => void;
  updateTaskMembers: (id: number | string, members: Member[]) => void;
}

export const KanbanColumn = (props: Props) => {
  const {
    column,
    deleteColumn,
    createTask,
    tasks,
    deleteTask,
    updateColumn,
    updateTask,
    updateTaskTitle,
    updateTaskMembers,
    markTaskDone,
    labels,
    labelColors,
    setIsModalsOpen,
    isModalsOpen,
    createLabel,
    updateLabelStatus,
    editLabel,
    deleteLabel,
    deleteLabelStatus,
    setTaskDeadline,
    removeTaskDeadline,
  } = props;

  const [edit, setEdit] = useState(false);

  const taskIds = useMemo(() => {
    return tasks.map((element) => element.Id);
  }, [tasks]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
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

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-grayscale-300 opacity-50 w-[300px] h-[500px] max-h-[500px] rounded-md"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg bg-grayscale-200 w-[300px] h-[500px] max-h-[500px] rounded-md flex flex-col overflow-auto"
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
            <KanbanTask
              removeTaskDeadline={removeTaskDeadline}
              setTaskDeadline={setTaskDeadline}
              deleteLabel={deleteLabel}
              editLabel={editLabel}
              deleteLabelStatus={deleteLabelStatus}
              updateLabelStatus={updateLabelStatus}
              createLabel={createLabel}
              task={element}
              key={element.Id}
              deleteTask={deleteTask}
              updateTask={updateTask}
              updateTaskTitle={updateTaskTitle}
              markTaskDone={markTaskDone}
              labels={labels}
              labelColors={labelColors}
              setIsModalsOpen={setIsModalsOpen}
              isModalsOpen={isModalsOpen}
              updateTaskMembers={updateTaskMembers}
            />
          ))}
        </SortableContext>
      </div>
      <button
        type="button"
        className="mt-4 py-2 heading-xs inline-flex items-center justify-center gap-1"
        onClick={() => createTask(column.Id)}
      >
        <Plus size={20} className="-ms-2.5" /> <p>Add task</p>
      </button>
    </div>
  );
};
