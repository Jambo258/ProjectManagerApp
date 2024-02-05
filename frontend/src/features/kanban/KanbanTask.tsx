// React
import { useState } from "react";

// DND Kit
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Components
import { X } from "react-feather";
import { IconButton } from "./IconButton";
import { DeleteModal } from "../../components/DeleteModal";
import { SubModal } from "./SubModal";
import { LabelModal } from "./LabelModal";
import { Label } from "./Label";
import { TaskMembersModal } from "./TaskMembersModal";
import { UserIcon } from "../user/UserIcon";

// Types and Interfaces
import { type Task, type Labels } from "./Kanban";
import { type Member } from "../api/apiSlice";

interface Props {
  task: Task;
  updateTask: (id: number | string, content: string) => void;
  updateTaskTitle: (id: number | string, title: string) => void;
  updateTaskMembers: (id: number | string, members: Member[]) => void;
  markTaskDone: (id: number | string) => void;
  deleteTask: (id: number | string) => void;
  label: Labels[];
  setLabel: React.Dispatch<React.SetStateAction<Labels[]>>;
  labels: Labels[];
  createLabel: (name: string, color: string) => void;
  editLabel: (id: string | number, name: string, color: string) => void;
  deleteLabel: (id: string | number) => void;
  updateLabelStatus: (id: string | number, activeStatus: boolean) => void;
  isModalsOpen: boolean;
  setIsModalsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const KanbanTask = ({
  task,
  updateTask,
  updateTaskTitle,
  updateTaskMembers,
  // markTaskDone,
  deleteTask,
  label,
  setLabel,
  labels,
  createLabel,
  editLabel,
  deleteLabel,
  updateLabelStatus,
  isModalsOpen,
  setIsModalsOpen,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
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
  const [isEditTitleSelected, setIsEditTitleSelected] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editContent, setEditContent] = useState(task.content);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  // This is used only for development, since there are already tasks with no members array
  const [taskMembers, setTaskMembers] = useState<Member[]>(task.members ? task.members : []);
  // For production
  // const [taskMembers, setTaskMembers] = useState<Member[]>(task.members);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const displayTaskLabels = label.map((element) => element.active ?
    (<Label
      key={element.id}
      labelColor={element.color}
      labelText={element.name}
    />
    ): null);

  const displayTaskMembers = taskMembers.map((member: Member) => member ?
    (<UserIcon
      key={member.id}
      id={member.id}
      name={member.name}
      small={true}
    />) : null);


  const handleSave = () => {
    console.log("Task saved");
    updateTask(task.Id, editContent);
    updateTaskTitle(task.Id, editTitle);
    updateTaskMembers(task.Id, taskMembers);
    closeModal();
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`w-full flex flex-col h-fit p-4 rounded ${isDragging ? "bg-grayscale-300 opacity-50" : "bg-grayscale-100 "}`}
        onClick={openModal}
      >
        <div className={isDragging ? "invisible" : ""}>
          <div className="mb-6">
            <h4 className="heading-xs mb-1">{task.title}</h4>
            {/* Line clamp needs fixing, this removes row changes when displaying content */}
            <p className="min-h-max line-clamp-3 body-text-xs">{task.content}</p>
          </div>

          <section className="w-full grid grid-flow-col grid-cols-2 gap-2">
            <div className="grid col-span-2">
              {/* Task Deadline */}
              <section className="w-full mb-1.5">
                <div
                  className={`rounded w-fit px-2 py-1 text-center ${
                    task.done ? "bg-success-100" : "bg-caution-100"
                  }`}
                >
                  <p className="label-text">{task.done ? "Done" : "Not Done"}</p>
                </div>
              </section>

              {/* Task Labels */}
              <section className="w-full h-fit flex flex-wrap gap-1.5">
                {displayTaskLabels}
              </section>
            </div>

            {/* Task Members */}
            <section className={"min-w-max w-fit h-full flex flex-row flex-wrap items-end"}>
              {displayTaskMembers}
            </section>
          </section>
        </div>
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
            {isEditTitleSelected ? (
              <input
                className="place-self-start -mt-3 mx-1 ps-1 p-0 heading-md text-dark-font"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  else setIsEditTitleSelected(false);
                }}
                onBlur={() => setIsEditTitleSelected(false)}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              ></input>
            ) : (
              <h3 onClick={() => setIsEditTitleSelected(true)} className="place-self-start -mt-3 mx-2 heading-md text-dark-font">
                {task.title}
              </h3>)}
          </header>

          <main className="w-full sm:max-w-prose grid grid-cols-12 sm:grid-cols-7 mx-auto px-2 gap-x-6">

            <section className="col-span-9 sm:col-span-5 flex flex-col gap-y-3">
              <div className="h-fit flex flex-row justify-between gap-x-2">
                {/* Task Members */}
                <section className="inline-flex flex-wrap gap-x-1 sm:max-w-[40ch]">
                  {displayTaskMembers}
                </section>
                {/* Task Deadline */}
                <section className={`rounded min-w-fit h-fit px-2 py-1 text-center ${task.done ? "bg-success-100" : "bg-caution-100"}`}>
                  <p className="label-text">
                    {task.done ? "Done" : "Not Done"}
                  </p>
                </section>
              </div>
              <section>
                <form>
                  <label role="h4" className="heading-xs mb-1">
                  Description
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                      placeholder="Short item description goes here..."
                      className="w-full block border px-1 py-0.5 body-text-sm border-grayscale-300 rounded"
                    />
                  </label>
                </form>
              </section>

              {/* Task Labels */}
              <section className="w-full h-fit flex flex-wrap gap-1.5">
                {displayTaskLabels}
              </section>
            </section>

            <aside className="grid col-span-3 sm:col-span-2 min-w-max gap-4">
              <section>
                <h5 className="heading-xxs mb-2">Add to task</h5>
                <div className="flex flex-col gap-2">

                  <SubModal
                    iconName="Members"
                    btnText="Members"
                    chevronShown={false}
                    modalTitle={"Members"}
                    setIsModalsOpen={setIsModalsOpen}
                    isModalsOpen={isModalsOpen}
                  >
                    <TaskMembersModal
                      taskMembers={taskMembers}
                      setTaskMembers={setTaskMembers}
                    />
                  </SubModal>

                  <SubModal
                    iconName="Labels"
                    btnText={"Labels"}
                    modalTitle={"Labels"}
                    setIsModalsOpen={setIsModalsOpen}
                    isModalsOpen={isModalsOpen}
                  >
                    <LabelModal
                      label={label}
                      labels={labels}
                      setLabel={setLabel}
                      setIsModalsOpen={setIsModalsOpen}
                      isModalsOpen={isModalsOpen}
                      createLabel={createLabel}
                      updateLabelStatus={updateLabelStatus}
                      editLabel={editLabel}
                      deleteLabel={deleteLabel}
                    />
                  </SubModal>

                  <IconButton
                    iconName="Deadline"
                    btnText="Deadline"
                    handleOnClick={() => ""}
                  />

                </div>
              </section>
              <section>
                <h5 className="heading-xxs mb-2">Actions</h5>
                <div className="flex flex-col gap-2 min-w-max">

                  <IconButton btnType="submit"
                    iconName="Save"
                    btnText="Save changes"
                    handleOnClick={handleSave}
                  />

                  <IconButton
                    iconName="Delete"
                    btnText="Delete task"
                    handleOnClick={() => setIsDeleteConfirmOpen(true)}
                  />

                </div>
              </section>
            </aside>
          </main>
        </dialog>
      </div>
      }

      {isDeleteConfirmOpen && (
        <DeleteModal
          setConfirmDeleteEdit={setIsDeleteConfirmOpen}
          confirmDeleteEdit={isDeleteConfirmOpen}
          handleSubmitForModal={() => deleteTask(task.Id)}
          deleteModalText={"Are you sure you want to delete this task?"} />
      )}
    </>
  );
};

{/* {!task.done && (
              <div className="border relative left-5">
                <TaskModal>
                  <div onClick={() => markTaskDone(task.Id)}>Mark as Done</div>
                  <div></div>
                </TaskModal>
              </div>
            )} */}
