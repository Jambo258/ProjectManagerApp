import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./Kanban";
import { useState } from "react";
import { TaskModal } from "./TaskModal";
import { Label } from "./Label";
import { IconButton } from "./IconButton";
import { X } from "react-feather";
import { useForm } from "react-hook-form";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editContent, setEditContent] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      description: task.content
    }
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onHandleSubmit = () => {
    console.log("Task saved");
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="w-full flex flex-col h-fit p-4 rounded bg-grayscale-100"
        onClick={openModal}
      >

        <div className="mb-6">
          <h4 className="heading-xs mb-1">
            {task.title}
          </h4>
          <p className="min-h-max line-clamp-3 body-text-xs">
            {task.content}
          </p>
        </div>

        <section className="w-full grid grid-flow-col grid-cols-2 gap-2">
          <div className="grid col-span-2">

            {/* Task Deadline */}
            <section className="w-full mb-[6px]">
              <div className={`rounded w-fit px-2 py-1 text-center ${task.done ? "bg-success-100" : "bg-caution-100"}`}>
                <p className="label-text">
                  {task.done ? "Done" : "Not Done"}
                </p>
              </div>
            </section>

            {/* Task Labels */}
            {/* Grid flow dense? */}
            <section className="w-full h-fit flex flex-wrap gap-[6px]">
              {task.labels?.map((element) => (
                <Label key={element.id} labelColor={element.color} labelText={element.name} />
              ))}
            </section>
          </div>

          {/* Task Members */}
          {/* TO DO:
        - map through members
        - if more than 1 move member icons to overlap
      */}
          <section className="min-w-max w-fit h-full flex flex-row">
            <p className="w-max px-4 py-3 self-end h-fit rounded-full bg-yellow-300">M</p>
          </section>
        </section>
      </div>

      {isModalOpen &&
      <div
        onClick={closeModal}
        className={`fixed flex justify-center inset-0 z-30 items-center transition-colors ${isModalOpen ? "visible bg-dark-blue-100/40" : "invisible"}`}>
        <dialog
          onClick={(e) => e.stopPropagation()}
          className="fixed w-full h-full sm:h-fit sm:min-w-max sm:max-w-prose p-2 pb-4 flex flex-col inset-0 z-30 sm:justify-center items-left overflow-x-hidden overflow-y-auto outline-none sm:rounded focus:outline-none shadow transition-all">

          <header className="w-full flex flex-col mb-2 place-items-end">
            <button
              onClick={closeModal}
              className="p-1 text-dark-font bg-grayscale-0 hover:bg-grayscale-0">
              <X size={20}/>
            </button>
            {editTitle ?(
              <input
                className="place-self-start -mt-3 mx-1 ps-1 p-0 heading-md text-dark-font"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  else setEditTitle(false);
                }}
                onBlur={() => setEditTitle(false)}
                value={task.title}
                onChange={(e) => updateTaskTitle(task.Id, e.target.value)}
              ></input>
            ) : (
              <h3 onClick={() => setEditTitle(true)} className="place-self-start -mt-3 mx-2 heading-md text-dark-font">
                { task.title }
              </h3>)}
          </header>

          <main className="w-full sm:max-w-full grid grid-cols-11 sm:grid-cols-4 mx-auto px-2 gap-x-6">

            <section className="col-span-9 sm:col-span-3 flex flex-col gap-y-3">
              <div className="h-fit flex flex-row justify-between">
                {/* Task Members */}
                <div className="">
                  <p className="w-max px-2 py-1 self-end h-fit rounded-full heading-xs bg-yellow-300">M</p>
                </div>
                {/* Task Deadline */}
                <div className={`rounded w-fit h-fit px-2 py-1 text-center ${task.done ? "bg-success-100" : "bg-caution-100"}`}>
                  <p className="label-text">
                    {task.done ? "Done" : "Not Done"}
                  </p>
                </div>
              </div>
              <div className="">
                <form onSubmit={handleSubmit(onHandleSubmit)}>
                  <label
                    className="heading-xs mb-1"
                  >
                  Description
                    <textarea
                      {...register("description")}
                      rows={4}
                      placeholder="Short item description goes here..."
                      className="w-full block border px-1 py-0.5 body-text-sm border-grayscale-300 rounded"
                    />
                    <p className="text-center body-text-xs text-caution-200 mt-1">{errors.description?.message}</p>
                  </label>
                </form>
              </div>

              {/* Task Labels */}
              <section className="w-full h-fit flex flex-wrap gap-[6px]">
                {task.labels?.map((element) => (
                  <Label key={element.id} labelColor={element.color} labelText={element.name} />
                ))}
              </section>
            </section>

            <section className="grid col-span-2 sm:col-span-1 min-w-max gap-4">
              <div>
                <p className="heading-xs mb-2">Add to task</p>
                <div className="flex flex-col gap-2">
                  <IconButton iconName="Members" btnText="Members" handleOnClick={() => ""}/>
                  <IconButton iconName="Labels" btnText="Labels" handleOnClick={() => ""}/>
                  <IconButton iconName="Deadline" btnText="Deadline" handleOnClick={() => ""}/>
                </div>
              </div>
              <div>
                <p className="heading-xs mb-2">Actions</p>
                <div className="flex flex-col gap-2 min-w-max">
                  <IconButton btnType="submit" iconName="Save" btnText="Save changes" handleOnClick={onHandleSubmit}/>
                  <IconButton iconName="Delete" btnText="Delete task" handleOnClick={() => deleteTask(task.Id)}/>
                </div>
              </div>
            </section>
          </main>
        </dialog>
      </div>

      }

    </>

  );
};


// export interface Task {
//   Id: string | number;
//   title: string;
//   columnId: string | number;
//   content: string;
//   done: boolean;
//   labels?: Label[];
// }

{/* <div className="heading-sm flex justify-between">
        {!editTitle && (
          <>
            <div onClick={() => setEditTitle(true)} className="">
              {task.title}
            </div> */}
{/* {!task.done && (
              <div className="border relative left-5">
                <TaskModal>
                  <div onClick={() => markTaskDone(task.Id)}>Mark as Done</div>
                  <div></div>
                </TaskModal>
              </div>
            )} */}
{/* </>
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
      </div> */}

{/* <div onClick={() => setEditContent(true)} className="">
        {!editContent && ( */}
{/* <div className="min-h-max line-clamp-2 body-text-xs">{task.content}</div> */}
{/* )}
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
      </div> */}





{/* <button onClick={() => deleteTask(task.Id)}>Delete task</button> */}
