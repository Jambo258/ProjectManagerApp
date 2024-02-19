//  React
import { useMemo, useState } from "react";

// DND-Kit
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Components
import { Plus } from "react-feather";
import { KanbanTask } from "./KanbanTask";
import { Menu } from "../../components/Menu";
import { DeleteModal } from "../../components/DeleteModal";

// Types and Interfaces
import type { Column, Labels, Task } from "./Kanban";
import { type Project, type Member } from "../api/apiSlice";

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
  project: Project | undefined;
  isUserViewer: boolean;
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
    project,
    isUserViewer,
  } = props;

  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(column.title);

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
    disabled: isUserViewer,
    data: {
      type: "Column",
      column,
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-grayscale-300 opacity-50 w-[300px] h-[700px] rounded-sm"
      ></div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value.trim() !== ""){
      setTitle(e.target.value);
    }
    else {
      setTitle("");
    }
  };


  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col bg-grayscale-200 w-[300px] h-[700px] rounded-sm overflow-auto text-dark-font"
    >
      <div
        {...attributes}
        {...listeners}
        className="min-h-max pl-3 py-3 pr-5 mb-1 m-[3px] relative inline-flex justify-between items-center rounded-sm bg-primary-100 focus:outline-none focus:ring focus:ring-dark-blue-50"
      >
        {isUserViewer || !edit ? (
          <div
            aria-label="Column title"
            onClick={() => setEdit(true)}
            className="heading-xs w-full mt-px px-1 -ml-1 pb-px mr-5 rounded-sm focus:outline-none focus:ring focus:ring-dark-blue-50"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEdit(true);
            }}
          >
            {column.title}
          </div>
        ) : (
          // TO DO:
          // Input field only shows one line, can this be changed to show multiple lines
          // Trello has h2 with role of textbox
          <input
            maxLength={15}
            type="text"
            className="w-full -ml-1 mr-6 px-1 py-0 heading-xs bg-primary-100 rounded-sm"
            autoFocus
            aria-label="Column title"
            onKeyDown={(e) => {
              if (e.key === "Enter"){
                setEdit(false);
                if(title){
                  updateColumn(column.Id, title);
                }
                else{
                  setTitle(column.title);
                }
              }
            }}
            onBlur={() => {
              setEdit(false);
              if(title){
                updateColumn(column.Id, title);
              }
              else{
                setTitle(column.title);
              }}}
            value={title}
            onChange={(e) => handleChange(e)}
          />
        )}
        {!isUserViewer &&
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
            onClick={() => setIsDeleteConfirmOpen(true)}
          >
            Delete column
          </button>
        </Menu>
        }
      </div>
      <div className="flex flex-grow flex-col gap-2 mb-2.5 py-1 items-center overflow-auto">
        <SortableContext items={taskIds} disabled={isUserViewer}>
          {tasks.map((element) => (
            <KanbanTask
              project={project}
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
              isUserViewer={isUserViewer}
            />
          ))}
        </SortableContext>
      </div>
      {!isUserViewer &&
      <button
        type="button"
        className="m-[3px] -mt-[3px] py-2 inline-flex gap-1 items-center justify-center btn-text-xs rounded-sm"
        onClick={() => createTask(column.Id)}
      >
        <Plus size={18} className="-ms-2.5" />
        <p>Add task</p>
      </button>
      }
      {isDeleteConfirmOpen && (
        <DeleteModal
          setConfirmDeleteEdit={setIsDeleteConfirmOpen}
          confirmDeleteEdit={isDeleteConfirmOpen}
          handleSubmitForModal={() => deleteColumn(column.Id)}
          deleteModalText={`Are you sure you want to delete the column ${column.title} and its tasks?`}
        />
      )}
    </div>
  );
};
