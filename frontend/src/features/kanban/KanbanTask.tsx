// React
import { useState } from "react";

// Redux
import { type Member } from "../api/apiSlice";

// DND Kit
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Components
import { X, Clock } from "react-feather";
import { type Task, type Labels } from "./Kanban";
import { Label } from "./Label";
import { IconButton } from "./IconButton";
import { DeleteModal } from "../../components/DeleteModal";
import { LabelModal } from "./LabelModal";
import { SubModal } from "./SubModal";
import { TaskMembersModal } from "./TaskMembersModal";
import { UserIcon } from "../user/UserIcon";
import { DeadlineModal } from "./DeadlineModal";

interface Props {
  removeTaskDeadline: (id: string | number) => void;
  setTaskDeadline: (
    id: string | number,
    deadline: number | object | undefined
  ) => void;
  task: Task;
  deleteTask: (id: number | string) => void;
  updateTask: (id: number | string, content: string) => void;
  updateTaskTitle: (id: number | string, title: string) => void;
  markTaskDone: (id: number | string) => void;
  label: Labels[];
  setLabel: React.Dispatch<React.SetStateAction<Labels[]>>;
  labels: Labels[];
  setIsModalsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalsOpen: boolean;
  createLabel: (name: string, color: string) => void;
  updateLabelStatus: (taskId: string, id: string) => void;
  deleteLabelStatus: (taskId: string, id: string) => void;
  editLabel: (
    taskId: string,
    id: string | number,
    name: string,
    color: string
  ) => void;
  deleteLabel: (id: string | number) => void;
}

export const KanbanTask = ({
  task,
  deleteTask,
  updateTask,
  updateTaskTitle,
  // markTaskDone,
  label,
  setLabel,
  labels,
  setIsModalsOpen,
  isModalsOpen,
  createLabel,
  updateLabelStatus,
  editLabel,
  deleteLabel,
  deleteLabelStatus,
  setTaskDeadline,
  removeTaskDeadline,
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
  const [isEditTitleSelected, setIsEditTitleSelected] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editContent, setEditContent] = useState(task.content);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [taskMembers, setTaskMembers] = useState<Member[]>([
    { id: 1, email: "suvi.sulonen@gmail.com", name: "Suvi", role: "manager" },
  ]);
  // console.log(isModalsOpen);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    console.log("Task saved");
    updateTask(task.Id, editContent);
    updateTaskTitle(task.Id, editTitle);
    closeModal();
  };

  const dateDifference = (endDate: number | object | undefined) => {
    const dateNow = new Date().getTime();
    const endDateString = endDate?.toString();
    const endDateInt = parseInt(endDateString!);
    const diffInMs = endDateInt - dateNow;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return parseInt(diffInDays.toFixed());
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
          <h4 className="heading-xs mb-1">{task.title}</h4>
          <p className="min-h-max line-clamp-3 body-text-xs">{task.content}</p>
        </div>

        <section className="w-full grid grid-flow-col grid-cols-2 gap-2">
          <div className="grid col-span-2">
            {/* Task Deadline */}
            <section className="w-full mb-[6px]">
              <div
                className={`rounded w-fit px-2 py-1 text-center ${
                  task.done ? "bg-success-100" : "bg-caution-100"
                }`}
              >
                <p className="label-text">{task.done ? "Done" : "Not Done"}</p>
              </div>
              {task.deadline && (
                <div
                  className={`rounded w-fit px-2 py-1 text-center ${
                    dateDifference(task.deadline?.endDate) > 2
                      ? "bg-success-100"
                      : "bg-caution-100"
                  }`}
                >
                  <p className="label-text inline-flex">
                    <Clock size={16}></Clock>
                    {dateDifference(task.deadline?.endDate)} Days left
                  </p>
                </div>
              )}
            </section>

            {/* Task Labels */}
            <section className="w-full h-fit flex flex-wrap gap-[6px]">
              {task.labels?.map((element) => (
                <Label
                  key={element.id}
                  labelColor={element.color}
                  labelText={element.name}
                />
              ))}
            </section>
          </div>

          {/* Task Members */}
          <section
            className={
              "min-w-max w-fit h-full flex flex-row flex-wrap items-end"
            }
          >
            {taskMembers.map((member: Member) => {
              return (
                <UserIcon
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  small={true}
                />
              );
            })}
          </section>
        </section>
      </div>

      {isModalOpen && (
        <div
          onClick={closeModal}
          className={`fixed flex justify-center inset-0 z-30 items-center transition-colors ${
            isModalOpen ? "visible bg-dark-blue-100/40" : "invisible"
          }`}
        >
          <dialog
            onClick={(e) => e.stopPropagation()}
            className="fixed w-full h-full sm:h-fit sm:min-w-max sm:max-w-prose p-2 pb-4 flex flex-col inset-0 z-30 sm:justify-center items-left overflow-x-hidden overflow-y-auto outline-none sm:rounded focus:outline-none shadow transition-all"
          >
            <header className="w-full flex flex-col mb-2 place-items-end">
              <button
                onClick={closeModal}
                className="p-1 text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
              >
                <X size={20} />
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
                <h3
                  onClick={() => setIsEditTitleSelected(true)}
                  className="place-self-start -mt-3 mx-2 heading-md text-dark-font"
                >
                  {task.title}
                </h3>
              )}
            </header>

            <main className="w-full sm:max-w-full grid grid-cols-11 sm:grid-cols-4 mx-auto px-2 gap-x-6">
              <section className="col-span-9 sm:col-span-3 flex flex-col gap-y-3">
                <div className="h-fit flex flex-row justify-between">
                  {/* Task Members */}
                  <div className="fles flex-row inline-flex gap-x-1">
                    {taskMembers.map((member: Member) => {
                      return (
                        <UserIcon
                          key={member.id}
                          id={member.id}
                          name={member.name}
                        />
                      );
                    })}
                  </div>
                  {/* Task Deadline */}
                  <div
                    className={`rounded w-fit h-fit px-2 py-1 text-center ${
                      task.done ? "bg-success-100" : "bg-caution-100"
                    }`}
                  >
                    <p className="label-text">
                      {task.done ? "Done" : "Not Done"}
                    </p>
                  </div>
                  {task.deadline && (
                    <div
                      className={`rounded w-fit px-2 py-1 text-center ${
                        dateDifference(task.deadline?.endDate) > 2
                          ? "bg-success-100"
                          : "bg-caution-100"
                      }`}
                    >
                      <p className="label-text inline-flex">
                        <Clock size={16}></Clock>
                        {dateDifference(task.deadline?.endDate)} Days left
                      </p>
                    </div>
                  )}
                </div>
                <div className="">
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
                </div>

                {/* Task Labels */}
                <section className="w-full h-fit flex flex-wrap gap-[6px]">
                  {task.labels?.map((element) => (
                    <Label
                      key={element.id}
                      labelColor={element.color}
                      labelText={element.name}
                    />
                  ))}
                </section>
              </section>

              <section className="grid col-span-2 sm:col-span-1 min-w-max gap-4">
                <div>
                  <h5 className="heading-xxs mb-2">Add to task</h5>
                  <div className="flex flex-col gap-2">
                    <SubModal
                      iconName="Members"
                      btnText="Members"
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
                        task={task}
                        label={label}
                        labels={labels}
                        setLabel={setLabel}
                        setIsModalsOpen={setIsModalsOpen}
                        isModalsOpen={isModalsOpen}
                        createLabel={createLabel}
                        updateLabelStatus={updateLabelStatus}
                        deleteLabelStatus={deleteLabelStatus}
                        editLabel={editLabel}
                        deleteLabel={deleteLabel}
                      />
                    </SubModal>
                    <SubModal
                      btnText={"Deadline"}
                      iconName="Deadline"
                      modalTitle={"Deadline"}
                      setIsModalsOpen={setIsModalsOpen}
                      isModalsOpen={isModalsOpen}
                    >
                      <DeadlineModal
                        task={task}
                        setTaskDeadline={setTaskDeadline}
                        removeTaskDeadline={removeTaskDeadline}
                      />
                    </SubModal>
                  </div>
                </div>
                <section>
                  <h5 className="heading-xxs mb-2">Actions</h5>
                  <div className="flex flex-col gap-2 min-w-max">
                    <IconButton
                      btnType="submit"
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
              </section>
            </main>
          </dialog>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <DeleteModal
          setConfirmDeleteEdit={setIsDeleteConfirmOpen}
          confirmDeleteEdit={isDeleteConfirmOpen}
          handleSubmitForModal={() => deleteTask(task.Id)}
          deleteModalText={"Are you sure you want to delete this task?"}
        />
      )}
    </>
  );
};

{
  /* {!task.done && (
              <div className="border relative left-5">
                <TaskModal>
                  <div onClick={() => markTaskDone(task.Id)}>Mark as Done</div>
                  <div></div>
                </TaskModal>
              </div>
            )} */
}
