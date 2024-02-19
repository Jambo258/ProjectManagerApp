import { type Dispatch, type SetStateAction, useContext } from "react";
import { Task, type Labels } from "./Kanban";
import { CreateLabelModal } from "./CreateLabelModal";
import { Square, CheckSquare } from "react-feather";
import { EditLabelModal } from "./EditLabelModal";
import { SubModal, SubModalContext } from "./SubModal";
import useScreenDimensions from "../../utils/screenDimensions";

interface Props {
  task: Task;
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

export const LabelModal = ({
  labels,
  labelColors,
  setIsModalsOpen,
  isModalsOpen,
  createLabel,
  updateLabelStatus,
  editLabel,
  deleteLabel,
  task,
  deleteLabelStatus,
}: Props) => {
  const taskLabelIds = task.labels?.map((label) => label.id) ?? [];
  const screenDimensions = useScreenDimensions();

  const { closeAllModals } = useContext(SubModalContext);

  const modalHandler = (status: boolean) => {
    if(status){
      setIsModalsOpen(true);
    } else {
      closeAllModals();
      setIsModalsOpen(false);
    }
  };

  const handleCheckboxToggle = (labelId: string | number, taskId: string) => {
    taskLabelIds.includes(labelId) ? deleteLabelStatus(taskId, labelId.toString()) : updateLabelStatus(taskId, labelId.toString());
  };

  return (
    <>
      <div className={`grid grid-flow-row gap-1 p-1 ${screenDimensions.height < 500 ? "overflow-visible" : "max-h-80 overflow-auto"}`}>
        {labels.map((label) => (
          <div
            key={label.id}
            className="w-full inline-flex place-items-center justify-center gap-2 m-auto"
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={taskLabelIds.includes(label.id) ? "Unselect label" : "Select label"}
              onClick={() => handleCheckboxToggle(label.id, task.Id)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                taskLabelIds.includes(label.id) ? deleteLabelStatus(task.Id, label.id.toString()) : updateLabelStatus(task.Id, label.id.toString());
              }}
              className="p-1 focus:outline-none focus:ring focus:ring-dark-blue-50 rounded"
            >
              {taskLabelIds.includes(label.id) ? <CheckSquare /> : <Square />}
            </div>
            <div
              onClick={() => handleCheckboxToggle(label.id, task.Id)}
              className={`py-1.5 text-center label-text rounded w-full justify-self-stretch ${label.color} `}
            >
              {label.name}
            </div>

            <div>
              <SubModal
                iconName="Edit"
                modalTitle={"Edit label"}
                setIsModalsOpen={modalHandler as Dispatch<SetStateAction<boolean>>}
                isModalsOpen={isModalsOpen}
              >
                <EditLabelModal
                  task={task}
                  label={label}
                  labelColors={labelColors}
                  editLabel={editLabel}
                  deleteLabel={deleteLabel}
                />
              </SubModal>
            </div>
          </div>
        ))}
        {labels.length === 0 && (<p className="text-center body-text-lg">No labels yet</p>)}
      </div>

      <section className="mt-4 w-full">
        <SubModal
          iconName="none"
          btnText={"Create new label"}
          modalTitle={"Create new label"}
          setIsModalsOpen={modalHandler as Dispatch<SetStateAction<boolean>>}
          isModalsOpen={isModalsOpen}
        >
          <CreateLabelModal
            labelColors={labelColors}
            createLabel={createLabel}
          />
        </SubModal>
      </section>
    </>
  );
};
