import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./DnDComponent";
import { useState } from "react";
import { TaskModal } from "./TaskModal";

interface Props {
  task: Task;
  deleteTask: (id: number | string) => void;
  updateTask: (id: number | string, content: string) => void;
  updateTaskTitle: (id: number | string, title: string) => void;
  markTaskDone: (id: number | string) => void;
}

export const SortableItemContent = ({
  task,
  deleteTask,
  updateTask,
  updateTaskTitle,
  markTaskDone,
}: Props) => {
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

  const [editTitle, setEditTitle] = useState(false);
  const [editContent, setEditContent] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className=" rounded-md p-4 grid grid-flow-row bg bg-grayscale-100"
    >
      <div className="heading-xs grid grid-flow-col mx-1">
        {!editTitle && (
          <>
            <div onClick={() => setEditTitle(true)} className="">
              {task.title}
            </div>
            {!task.done && (
              <div className="relative left-5">
                <TaskModal>
                  <div onClick={() => markTaskDone(task.Id)}>Mark as Done</div>
                  <div></div>
                </TaskModal>
              </div>
            )}
          </>
        )}
        {editTitle && (
          <input
            className="w-36 text-sm bg bg-primary-200 rounded-md"
            autoFocus
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEditTitle(false);
            }}
            onBlur={() => setEditTitle(false)}
            value={task.title}
            onChange={(e) => updateTaskTitle(task.Id, e.target.value)}
          ></input>
        )}
      </div>

      <div onClick={() => setEditContent(true)} className="">
        {!editContent && (
          <div className="mx-1 mt-4 h-[50px] min-h-[50px]">{task.content}</div>
        )}
        {editContent && (
          <input
            className="w-36 text-sm bg bg-primary-200 rounded-md"
            autoFocus
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEditContent(false);
            }}
            onBlur={() => setEditContent(false)}
            value={task.content}
            onChange={(e) => updateTask(task.Id, e.target.value)}
          ></input>
        )}
      </div>
      <div className="w-16 text-center mx-1 my-2">
        {task.done ? (
          <div className="rounded-md text-grayscale-200 p-2 bg-success-100">
            Done
          </div>
        ) : (
          <div className="rounded-md text-grayscale-200 p-2 bg-caution-100">
            Not Done
          </div>
        )}
      </div>
      <div className="w-16 text-center my-2 grid grid-flow-col">
        {task.labels?.map((element) => (
          <div
            className={`mx-1 rounded md p-2 ${element.color}`}
            key={element.id}
          >
            {element.name}
          </div>
        ))}
      </div>
      <button onClick={() => deleteTask(task.Id)}>Delete task</button>
    </div>
  );
};
