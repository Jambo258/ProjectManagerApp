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
import useScreenDimensions from "../../utils/screenDimensions";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { taskTitleSchema, taskContentSchema } from "./taskAndColumnValidation";

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
  updateTaskMembers: (id: number | string, members: Member) => void;
  removeTaskMembers: (id: number | string, members: Member) => void;
  markTaskDone: (id: number | string) => void;
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

export interface taskTitleFormValues {
  title: string;
}

export interface taskContentFormValues {
  content?: string;
}

export const KanbanTask = ({
  task,
  deleteTask,
  updateTask,
  updateTaskTitle,
  updateTaskMembers,
  removeTaskMembers,
  // markTaskDone,
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
  // const [editTitle, setEditTitle] = useState("");
  // const [editContent, setEditContent] = useState(task.content);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  // This is used only for development, since there are already tasks with no members array
  const [taskMembers, setTaskMembers] = useState<Member[]>(
    task.members ? task.members : []
  );
  // For production
  // const [taskMembers, setTaskMembers] = useState<Member[]>(task.members);

  console.log(taskMembers);
  const {
    formState: { errors: errorsTitle },
    handleSubmit,
    register,
  } = useForm<taskTitleFormValues>({
    // mode: "onChange",
    defaultValues: {
      title: task.title,
    },
    resolver: yupResolver(taskTitleSchema),
  });

  const {
    formState: { errors: errorsContent },
    handleSubmit: contentSubmit,
    register: contentRegister,
  } = useForm<taskContentFormValues>({
    defaultValues: {
      content: task.content,
    },
    resolver: yupResolver(taskContentSchema),
  });
  console.log(errorsTitle);
  console.log(task.title);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const displayTaskLabels = task.labels?.map((label) => (
    <Label key={label.id} labelColor={label.color} labelText={label.name} />
  ));

  const displayTaskMembers = taskMembers.map((member: Member) =>
    member ? (
      <UserIcon
        key={member.id}
        id={member.id}
        name={member.name}
        small={true}
      />
    ) : null
  );

  const handleSave = () => {
    // updateTask(task.Id, editContent);
    // updateTaskTitle(task.Id, editTitle );
    // updateTaskMembers(task.Id, taskMembers);
    closeModal();
  };

  const titleHandler = (formData: taskTitleFormValues) => {
    updateTaskTitle(task.Id, formData.title);
  };

  const contentHandler = (formData: taskContentFormValues) => {
    updateTask(task.Id, formData.content!);
  };

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

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`w-full flex flex-col h-fit p-4 rounded ${
          isDragging ? "bg-grayscale-300 opacity-50" : "bg-grayscale-100 "
        }`}
        onClick={openModal}
      >
        <div className={isDragging ? "invisible" : ""}>
          <div className="mb-6">
            <h4 className="heading-xs mb-1">{task.title}</h4>
            {/* Line clamp needs fixing, this removes row changes when displaying content */}
            <p className="min-h-max line-clamp-3 body-text-xs">
              {task.content}
            </p>
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
                  <p className="label-text">
                    {task.done ? "Done" : "Not Done"}
                  </p>
                </div>
                {task.deadline && (
                  <div
                    className={`rounded w-fit px-2 py-1 text-center ${
                      dateDifference(task.deadline) > 2
                        ? "bg-success-100"
                        : "bg-caution-100"
                    }`}
                  >
                    <p className="label-text inline-flex">
                      <Clock size={16}></Clock>
                      {dateDifference(task.deadline)} Days left
                    </p>
                  </div>
                )}
              </section>

              {/* Task Labels */}
              <section className="w-full h-fit flex flex-wrap gap-1.5">
                {displayTaskLabels}
              </section>
            </div>

            {/* Task Members */}
            <section
              className={
                "min-w-max w-fit h-full flex flex-row flex-wrap items-end"
              }
            >
              {displayTaskMembers}
            </section>
          </section>
        </div>
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
                className="p-1 text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
              >
                <X size={20} />
              </button>
              {isEditTitleSelected ? (
                <>
                  <input
                    className="place-self-start -mt-3 mx-1 ps-1 p-0 heading-md text-dark-font"
                    autoFocus
                    required={true}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      else {
                        setIsEditTitleSelected(false);
                      }
                    }}
                    value={task.title}
                    {...register("title", {
                      onChange: async () => {
                        await handleSubmit(titleHandler)();
                      },
                      onBlur: () => {
                        setIsEditTitleSelected(false);
                      },
                    })}
                  ></input>
                  {errorsTitle.title && (
                    <p className="place-self-start mt-1 text-center body-text-xs text-caution-200">
                      {errorsTitle.title.message}
                    </p>
                  )}
                </>
              ) : (
                <h3
                  onClick={() => setIsEditTitleSelected(true)}
                  className="place-self-start -mt-3 mx-2 heading-md text-dark-font"
                >
                  {task.title}
                </h3>
              )}
            </header>

            <main className="w-full sm:max-w-prose grid grid-cols-12 sm:grid-cols-7 mx-auto px-2 gap-x-6">
              <section className="col-span-9 sm:col-span-5 flex flex-col gap-y-3">
                <div className="h-fit flex flex-row justify-between gap-x-2">
                  {/* Task Members */}
                  <section className="inline-flex flex-wrap gap-x-1 sm:max-w-[40ch]">
                    {displayTaskMembers}
                  </section>
                  {/* Task Deadline */}
                  <div
                    className={`rounded min-w-fit h-fit px-2 py-1 text-center ${
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
                        dateDifference(task.deadline) > 2
                          ? "bg-success-100"
                          : "bg-caution-100"
                      }`}
                    >
                      <p className="label-text inline-flex">
                        <Clock size={16}></Clock>
                        {dateDifference(task.deadline)} Days left
                      </p>
                    </div>
                  )}
                </div>
                <section>
                  <form>
                    <label role="h4" className="heading-xs mb-1">
                      Description
                      <textarea
                        value={task.content}
                        {...contentRegister("content", {
                          onChange: async () => {
                            await contentSubmit(contentHandler)();
                          },
                          // onBlur: () => {
                          //   setIsEditTitleSelected(false);
                          // },
                        })}
                        // value={editContent}
                        // onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        placeholder="Short item description goes here..."
                        className="w-full block border px-1 py-0.5 body-text-sm border-grayscale-300 rounded"
                      />
                      {errorsContent.content && (
                        <p className="mt-1 text-center body-text-xs text-caution-200">
                          {errorsContent.content.message}
                        </p>
                      )}
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
                      modalTitle={"Members"}
                      chevronShown={false}
                      setIsModalsOpen={setIsModalsOpen}
                      isModalsOpen={isModalsOpen}
                    >
                      <TaskMembersModal
                        taskMembers={taskMembers}
                        setTaskMembers={setTaskMembers}
                        updateTaskMembers={updateTaskMembers}
                        removeTaskMembers={removeTaskMembers}
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
                  </div>
                </section>
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
