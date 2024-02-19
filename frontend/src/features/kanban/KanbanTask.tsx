// React
import { useState, useEffect, useRef } from "react";

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
import useScreenDimensions from "../../utils/screenDimensions";
import { format } from "date-fns";

interface Props {
  removeTaskDeadline: (id: string | number) => void;
  setTaskDeadline: (
    id: string | number,
    deadline: number | undefined
  ) => void;
  task: Task;
  deleteTask: (id: number | string) => void;
  updateTask: (id: number | string, content: string) => void;
  updateTaskTitle: (id: number | string, title: string) => void;
  addTaskMember: (id: number | string, newMember: Member) => void;
  removeTaskMember: (id: number | string, newMember: Member) => void
  labels: Labels[];
  labelColors: Labels[];
  setIsModalsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalsOpen: boolean;
  createLabel: (name: string, color: string) => void;
  updateLabelStatus: (taskId: string, id: string) => void;
  deleteLabelStatus: (taskId: string, id: string) => void;
  editLabel: (id: string | number, name: string, color: string) => void;
  deleteLabel: (id: string | number) => void;
}

export const KanbanTask = ({
  task,
  deleteTask,
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
}: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
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
  const screenDimensions = useScreenDimensions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditTitleSelected, setIsEditTitleSelected] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const taskModalRef = useRef(null as HTMLDialogElement | null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const displayTaskLabels = task.labels?.map((label) => (
    <Label key={label.id} labelColor={label.color} labelText={label.name} />
  ));

  const displayTaskMembers = task.members.map((member: Member) =>
    member ? (
      <UserIcon
        key={member.id}
        id={member.id}
        name={member.name}
        small={true}
      />
    ) : null
  );

  const dateDifference = (endDate: number | object | undefined) => {
    const dateNow = new Date().getTime();
    if (typeof endDate === "number") {
      const diffInMs = endDate - dateNow;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      return Math.ceil(diffInDays);
    } else {
      return 0;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value.trim() !== ""){
      setTitle(e.target.value);
    }
    else {
      setTitle("");
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      const taskModalElement = taskModalRef.current;
      const focusableElements = taskModalElement!.querySelectorAll(
        "button, input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            (lastElement as HTMLDialogElement).focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === lastElement
          ) {
            event.preventDefault();
            (firstElement as HTMLDialogElement).focus();
          }
        }
      };

      const closeOnEscapePressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closeModal();
        }
      };
      document.addEventListener("keydown", closeOnEscapePressed);
      taskModalElement?.addEventListener("keydown", handleTabKeyPress);
      return () => {

        document.removeEventListener("keydown", closeOnEscapePressed);
        taskModalElement?.removeEventListener("keydown", handleTabKeyPress);
      };
    }
  }, [isModalOpen]);

  if (!task.labels) {
    return null;
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`w-[calc(100%-6px)] flex flex-col h-fit p-4 rounded-sm focus:outline-none focus:ring-[3px] focus:ring-dark-blue-50 ${
          isDragging ? "bg-grayscale-300 opacity-50" : "bg-grayscale-100"
        }`}
        onClick={openModal}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          openModal();
        }}
      >
        <div className={isDragging ? "invisible" : ""}>
          <h4 className="heading-xs mb-1">{task.title}</h4>
          {task.content !== "" &&
            <p className="min-h-max line-clamp-2 body-text-xs whitespace-pre-wrap mb-4">
              {task.content}
            </p>
          }

          <section className="w-full flex flex-col gap-2">
            {/* Task Deadline */}
            <section className="inline-flex w-full justify-between">
              {task.deadline && (
                <div
                  className={`rounded w-fit pt-0.5 px-2 text-center ${
                    dateDifference(task.deadline) > 2
                      ? "bg-success-100"
                      : "bg-caution-100"
                  }`}
                >
                  <div className="label-text inline-flex items-center gap-1">
                    <Clock size={14}/>
                    {task.deadline > new Date().getTime()
                      ? dateDifference(task.deadline) + " days left"
                      : format(new Date(task.deadline), "d.M.yyyy")}
                  </div>
                </div>
              )}

              {/* Task Members when there's less than 4 */}
              {task.members.length < 6 &&
                <section
                  className={
                    "min-w-max w-fit h-full flex flex-row flex-wrap items-end"
                  }
                >
                  {displayTaskMembers}
                </section>
              }
            </section>

            {/* Task Labels */}
            <section className="w-full h-fit flex flex-wrap gap-1.5">
              {displayTaskLabels}
            </section>

            {/* Task Members when there is 4 or more */}
            {task.members.length > 5 &&
            <section
              className={
                "w-full h-fit flex flex-row flex-wrap items-end"
              }
            >
              {displayTaskMembers}
            </section>
            }
          </section>
        </div>
      </div>

      {isModalOpen && (
        <div
          onMouseDown={closeModal}
          className={`fixed flex justify-center inset-0 z-30 items-center transition-colors ${
            isModalOpen ? "visible bg-dark-blue-100/40" : "invisible"
          }`}
        >
          <dialog
            tabIndex={-1}
            ref={taskModalRef}
            onMouseDown={(e) => e.stopPropagation()}
            className={`max-h-screen fixed p-2 pb-4 flex flex-col inset-0 z-30 sm:justify-start items-left overflow-x-hidden overflow-y-auto outline-none sm:rounded focus:outline-none shadow transition-all
          ${
        screenDimensions.height < 500
          ? "min-h-screen w-full"
          : "w-full h-full sm:h-fit sm:w-fit sm:max-w-prose"
        }`}
          >
            <header className="w-full flex flex-col mb-2 place-items-end">
              <button
                onClick={closeModal}
                aria-label="Close task"
                className="p-1 text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
              >
                <X size={20} />
              </button>
              {isEditTitleSelected ? (
                <input
                  maxLength={15}
                  className="place-self-start -mt-3 mx-1 ps-1 p-0 heading-md text-dark-font"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter"){
                      setIsEditTitleSelected(false);
                      if(title){
                        updateTaskTitle(task.Id, title);
                      }
                      else{
                        setTitle(task.title);
                      }
                    }
                  }}
                  onBlur={() => {
                    setIsEditTitleSelected(false);
                    if(title){
                      updateTaskTitle(task.Id, title);
                    }
                    else{
                      setTitle(task.title);
                    }
                  }}
                  value={title}
                  onChange={(e) => handleChange(e)}
                />
              ) : (
                <h3
                  onClick={() => setIsEditTitleSelected(true)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    setIsEditTitleSelected(true);
                  }}
                  tabIndex={0}
                  className="w-7/12 place-self-start -mt-3 mx-1 ps-1 rounded heading-md text-dark-font focus:outline-none focus:ring focus:ring-dark-blue-50"
                >
                  {task.title}
                </h3>
              )}
            </header>

            <main className="w-full sm:max-w-prose grid grid-cols-12 sm:grid-cols-7 mx-auto px-2 gap-x-6">
              <section className="col-span-9 sm:col-span-5 flex flex-col gap-y-3">
                <div className="h-fit flex flex-row justify-between items-start gap-x-2">
                  {/* Task Members */}
                  <section className="inline-flex flex-wrap gap-x-1 sm:max-w-[40ch]">
                    {displayTaskMembers}
                  </section>
                  {/* Task Deadline */}
                  {task.deadline && (
                    <div
                      className={`rounded w-fit pt-0.5 px-2 text-center ${
                        dateDifference(task.deadline) > 2
                          ? "bg-success-100"
                          : "bg-caution-100"
                      }`}
                    >
                      <div className="label-text inline-flex items-start gap-1 ">
                        <Clock size={14}/>
                        {task.deadline > new Date().getTime()
                          ? dateDifference(task.deadline) + " days left"
                          : format(new Date(task.deadline), "d.M.yyyy")}
                      </div>
                    </div>
                  )}
                </div>
                <section>
                  <form>
                    <label role="h4" className="heading-xs mb-1">
                      Description
                      <textarea
                        value={task.content}
                        onChange={(e) => updateTask(task.Id, e.target.value)}
                        rows={4}
                        placeholder="Short item description goes here..."
                        className="w-full block border px-1 py-0.5 body-text-sm border-grayscale-300 rounded"
                      />
                    </label>
                  </form>
                </section>

                {/* Task Labels */}
                <section className={task.labels?.length < 1 ? "hidden": "w-full h-fit flex flex-wrap gap-1.5"}>
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
                      modalTitle={"Members"}
                      chevronShown={false}
                      setIsModalsOpen={setIsModalsOpen}
                      isModalsOpen={isModalsOpen}
                    >
                      <TaskMembersModal
                        addTaskMember={addTaskMember}
                        removeTaskMember={removeTaskMember}
                        task={task}
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
                        labels={labels}
                        labelColors={labelColors}
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
