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
    deadline: number | object | undefined
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

  const compareDates = (date: Date) => {
    if (new Date().setHours(0,0,0,0) <= date.setHours(0,0,0,0)) {
      return true;
    } else {
      return false;
    }
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
              return "aspect-square !bg-primary-100 !hover:bg-primary-200 rounded-full";   
            }

            if (compareDates(date)) {
              return "aspect-square rounded-full"; 
            }  
            
            return "aspect-square !text-grayscale-300"; 
          }

          // Year view
          if (view === "year" 
              && date.getMonth() < (new Date().getMonth()) 
              && date.getFullYear() <= (new Date().getFullYear())) {
            return "!text-grayscale-300";
          }

          // Decade view
          if (view === "decade" 
              && date.getFullYear() < (new Date().getFullYear())) {
            return "!text-grayscale-300";
          } 
        }}
        onClickDay={(day) => {setDeadline(day);}}
        prevLabel={<ChevronLeft className="relative top-1"/>}   
        nextLabel={<ChevronRight className="relative top-1" />}
        prev2Label={<ChevronsLeft className="relative top-1"/>}  
        next2Label={<ChevronsRight className="relative top-1" />}
      />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleDeadlineSave}
          name="save"
          className="py-2 my-2 btn-text-sm bg-success-100 hover:bg-success-200"
        >
            Save
        </button>
        {task.deadline ? 
          <button
            type="button"
            onClick={() => setConfirmDeleteEdit(true)}
            name="remove"
            className="py-2 my-2 btn-text-sm bg-caution-100 hover:bg-caution-200"
          >
              Remove
          </button>
          : <button 
            type="button"
            onClick={() => closeModal()}
            className="py-2 my-2 btn-text-sm">Cancel</button>  
        }

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
  );
};
