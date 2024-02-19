import { useContext, useState } from "react";
import Calendar from "react-calendar";
import { Task } from "./Kanban";
import { SubModalContext } from "./SubModal";
import { DeleteModal } from "../../components/DeleteModal";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "react-feather";

interface Props {
  task: Task;
  setTaskDeadline: (
    id: string | number,
    deadline: number | undefined
  ) => void;
  removeTaskDeadline: (id: string | number) => void;
}
export const DeadlineModal = ({
  setTaskDeadline,
  task,
  removeTaskDeadline,
}: Props) => {
  const [deadline, setDeadline] = useState<Date>(
    task.deadline ? new Date(Number(task.deadline)) : new Date()
  );
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const { closeModal } = useContext(SubModalContext);

  const handleDeadlineSave = () => {
    setTaskDeadline(task.Id, deadline?.valueOf());
    closeModal();
  };

  const handleDeadlineRemove = () => {
    removeTaskDeadline(task.Id);
    closeModal();
  };

  return (
    <div className="text-center w-fit m-auto">
      <Calendar
        locale="en-GB"
        className="calendar"
        minDate={new Date()}
        value={deadline}
        selectRange={false}
        minDetail="decade"
        tileClassName={({ date, view }) => {

          // Month view
          if (view === "month") {
            if (deadline.getDate() === date.getDate()
                && deadline.getMonth() === date.getMonth()
                && deadline.getFullYear() === date.getFullYear()) {
              return "aspect-square !btn-text-sm !bg-primary-100 !hover:bg-primary-200 rounded-full border-4 border-grayscale-100";
            }

            if (new Date().setHours(0,0,0,0) <= date.setHours(0,0,0,0)) {
              return "aspect-square !btn-text-sm rounded-full";
            }

            return "aspect-square !btn-text-sm !text-grayscale-300";
          }

          // Year view
          if (view === "year"
              && date.getMonth() < (new Date().getMonth())
              && date.getFullYear() <= (new Date().getFullYear())) {
            return "!text-grayscale-300 !btn-text-sm";
          }

          // Decade view
          if (view === "decade"
              && date.getFullYear() < (new Date().getFullYear())) {
            return "!btn-text-sm !text-grayscale-300";
          }

          return "!btn-text-sm";
        }}
        onClickDay={(day) => setDeadline(day)}
        prevLabel={<ChevronLeft size={18} />}
        nextLabel={<ChevronRight size={18} />}
        prev2Label={<ChevronsLeft size={18} />}
        next2Label={<ChevronsRight size={18} />}
      />

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={handleDeadlineSave}
          name="save"
          className="py-2 my-2 btn-text-xs bg-success-100 hover:bg-success-200"
        >
            Save
        </button>
        {task.deadline ?
          <button
            type="button"
            onClick={() => setConfirmDeleteEdit(true)}
            name="remove"
            className="py-2 my-2 btn-text-xs bg-caution-100 hover:bg-caution-200"
          >
              Remove
          </button>
          : <button
            type="button"
            onClick={closeModal}
            className="py-2 my-2 btn-text-xs">Cancel</button>
        }

        {confirmDeleteEdit && (
          <DeleteModal
            setConfirmDeleteEdit={setConfirmDeleteEdit}
            confirmDeleteEdit={confirmDeleteEdit}
            handleSubmitForModal={handleDeadlineRemove}
            deleteModalText="Are you sure you want to remove this deadline?"
          />
        )}
      </div>
    </div>
  );
};
