import { useContext, useState } from "react";
import Calendar from "react-calendar";
import { Task } from "./Kanban";
import { SubModalContext } from "./SubModal";
import { DeleteModal } from "../../components/DeleteModal";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Props {
  task: Task;
  setTaskDeadline: (
    id: string | number,
    deadline: number | object | undefined
  ) => void;
  removeTaskDeadline: (id: string | number) => void;
}
export const DeadlineModal = ({
  setTaskDeadline,
  task,
  removeTaskDeadline,
}: Props) => {
  const [date, setDate] = useState<Value>(
    task.deadline ? new Date(Number(task.deadline)) : new Date()
  );
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const { closeModal } = useContext(SubModalContext);

  const handleDeadlineSave = () => {
    setTaskDeadline(task.Id, date?.valueOf());
    closeModal();
  };

  const handleDeadlineRemove = () => {
    removeTaskDeadline(task.Id);
    closeModal();
  };

  console.log(date);
  return (
    <div className="max-w-xl text-center">
      <Calendar
        locale="en-GB"
        className=""
        minDate={new Date()}
        onChange={setDate}
        value={date}
        tileClassName={({ date, view }) => {
          if (view === "month" && task.deadline) {
            const markedDate = new Date(Number(task.deadline));

            if (
              date.getDate() === markedDate.getDate() &&
              date.getMonth() === markedDate.getMonth() &&
              date.getFullYear() === markedDate.getFullYear()
            ) {
              return "bg-caution-200";
            }
          }
        }}
      />
      <div className="border-t-2 mt-4 p-2">Set a Deadline</div>
      <div className="grid grid-flow-row">
        <input
          readOnly={true}
          value={date?.toLocaleString().slice(0, 9)}
        ></input>
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={handleDeadlineSave}
            name="save"
            className="py-2 my-2 mx-2 btn-text-sm bg-success-100 hover:bg-success-200"
          >
            Save
          </button>
          {task.deadline && (
            <button
              type="button"
              onClick={() => setConfirmDeleteEdit(true)}
              name="remove"
              className="py-2 my-2 mx-2 btn-text-sm bg-caution-100 hover:bg-caution-200"
            >
              Remove
            </button>
          )}
          {confirmDeleteEdit && (
            <DeleteModal
              setConfirmDeleteEdit={setConfirmDeleteEdit}
              confirmDeleteEdit={confirmDeleteEdit}
              handleSubmitForModal={handleDeadlineRemove}
              deleteModalText={"Are you sure you want to delete this Deadline?"}
            />
          )}
        </div>
      </div>
    </div>
  );
};
