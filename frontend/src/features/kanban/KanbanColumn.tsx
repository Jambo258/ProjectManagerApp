import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { KanbanTask } from "./KanbanTask";
import { Column, Labels, Task } from "./Kanban";
import { TaskModal } from "./TaskModal";
import { Plus } from "react-feather";
import { type Member } from "../api/apiSlice";
import { Menu } from "../../components/Menu";

interface Props {
  removeTaskDeadline: (id: string | number) => void;
  setTaskDeadline: (
    id: string | number,
    deadline: number | undefined
  ) => void;
  column: Column;
  deleteColumn: (id: string | number) => void;
  updateColumn: (id: string | number, title: string) => void;
  createTask: (columnId: string | number) => void;
  tasks: Task[];
  deleteTask: (id: string | number) => void;
  updateTask: (id: string | number, content: string) => void;
  updateTaskTitle: (id: string | number, title: string) => void;
  labels: Labels[];
  labelColors: Labels[];
  setIsModalsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalsOpen: boolean;
  createLabel: (name: string, color: string) => void;
  updateLabelStatus: (taskId: string, id: string) => void;
  deleteLabelStatus: (taskId: string, id: string) => void;
  editLabel: (id: string | number, name: string, color: string) => void;
  deleteLabel: (id: string | number) => void;
  addTaskMember: (id: number | string, newMember: Member) => void;
  removeTaskMember: (id: number | string, newMember: Member) => void;
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
    addTaskMember,
    removeTaskMember,
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
        className="bg-grayscale-300 opacity-50 w-[300px] h-[500px] max-h-[500px] rounded-sm"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col bg-grayscale-200 w-[300px] h-[500px] max-h-[500px] rounded-sm overflow-auto text-dark-font"
    >
      <div
        {...attributes}
        {...listeners}
        className="min-h-max pl-3 py-3 pr-5 mb-3 relative inline-flex justify-between items-center rounded-sm bg-primary-100"
        // onClick={() => setEdit(true)}
      >
        {!edit && (
          <div
            onClick={() => setEdit(true)}
            className="heading-xs mt-px pb-px ml-px mr-5"
          >
            {column.title}
          </div>
        )}
        {edit && (
          // Input field only shows one line
          // Trello has h2 with role as textbox
          <input
            className="w-full -ml-1 mr-6 px-1 py-0 heading-xs bg-primary-100 rounded-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEdit(false);
            }}
            onBlur={() => setEdit(false)}
            value={column.title}
            onChange={(e) => {
              if (e.target.value.length >= 1) {
                updateColumn(column.Id, e.target.value);
              }
            }}
          ></input>
        )}
        <Menu
          btnPosition="absolute right-2.5 top-3.5"
          menuPosition="relative mt-1"
        >
          <button
            className="min-w-max w-full px-2 py-1.5 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100 hover:text-dark-font/60"
            onClick={() => createTask(column.Id)}
          >
            Add task
          </button>
          <button
            className="min-w-max w-full px-2 py-1.5 pe-4 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100 hover:text-dark-font/60"
            onClick={() => deleteColumn(column.Id)}
          >
            Delete column
          </button>
        </Menu>
        {/* <TaskModal>
          <div onClick={() => deleteColumn(column.Id)}>Delete</div>
          <div></div>
        </TaskModal> */}
      </div>
      <div className="flex flex-grow flex-col gap-3 mb-3">
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
              labels={labels}
              labelColors={labelColors}
              setIsModalsOpen={setIsModalsOpen}
              isModalsOpen={isModalsOpen}
              addTaskMember={addTaskMember}
              removeTaskMember={removeTaskMember}
            />
          ))}
        </SortableContext>
      </div>
      <button
        type="button"
        // TO DO:
        // Fix focus, get's cut off
        className="py-2 inline-flex gap-1 items-center justify-center btn-text-xs rounded-sm"
        onClick={() => createTask(column.Id)}
      >
        <Plus size={18} className="-ms-2.5" />
        <p>Add task</p>
      </button>
    </div>
  );
};
