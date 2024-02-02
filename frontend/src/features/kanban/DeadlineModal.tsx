import { useContext, useState } from "react";
import Calendar from "react-calendar";
import { Task } from "./Kanban";
import { SubModalContext } from "./SubModal";
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Props {
  task: Task;
  setTaskDeadline: (id: string | number, deadline: number | object | undefined) => void;
}
export const DeadlineModal = ({setTaskDeadline, task}:Props) => {
  const [date, setDate] = useState<Value>(new Date());
  const { closeModal } = useContext(SubModalContext);

  const handleDeadlineSave = () => {
    console.log("work?", date?.valueOf());
    // setTaskDeadline(task.Id, date?.toLocaleString().slice(0, 9));
    setTaskDeadline(task.Id, date?.valueOf());

    closeModal();
  };

  return (
    <div className="max-w-xl">
      <Calendar className="border border-red-100" minDate={new Date()} onChange={setDate} /*value={new Date(task.deadline?.endDate)}*/ />
      <div className="border-t-2 mt-4 p-2">Set a Deadline</div>
      <div className="grid grid-flow-row">
        <input readOnly={true} value={date?.toLocaleString().slice(0,9)}></input>
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={handleDeadlineSave}
            name="save"
            className="py-2 my-2 mx-2 btn-text-sm bg-success-100 hover:bg-success-200"
          >
            Save
          </button>
          <button
            type="button"
            // onClick={() => setConfirmDeleteEdit(true)}
            name="remove"
            className="py-2 my-2 mx-2 btn-text-sm bg-caution-100 hover:bg-caution-200"
          >
            Remove
          </button>
          {date?.toString()}
        </div>
      </div>
    </div>
  );
};
