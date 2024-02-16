import { type Dispatch, type SetStateAction, useContext } from "react";
import { Task, type Labels } from "./Kanban";
import { CreateLabelModal } from "./CreateLabelModal";
import { Square, CheckSquare } from "react-feather";
import { EditLabelModal } from "./EditLabelModal";
import { SubModal, SubModalContext } from "./SubModal";

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

  const { closeAllModals } = useContext(SubModalContext);

  const modalHandler = (status: boolean) => {
    if(status){
      setIsModalsOpen(true);
    } else {
      closeAllModals();
      setIsModalsOpen(false);
    }
  };

  return (
    <>
      <div className="grid grid-flow-row gap-1">
        {labels.map((label) => (
          <div
            key={label.id}
            className="inline-flex place-items-center justify-center gap-2 m-auto"
          >
            <button
              aria-label={taskLabelIds.includes(label.id) ? "Unselect label" : "Select label"}
              onClick={() => {
                taskLabelIds.includes(label.id) ? deleteLabelStatus(task.Id, label.id.toString()) : updateLabelStatus(task.Id, label.id.toString());
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                taskLabelIds.includes(label.id) ? deleteLabelStatus(task.Id, label.id.toString()) : updateLabelStatus(task.Id, label.id.toString());
              }}
              className="p-1 bg-grayscale-0 hover:bg-grayscale-0"
            >
              {taskLabelIds.includes(label.id) ? <CheckSquare /> : <Square />}
            </button>
            <div
              className={`py-1.5 text-center label-text rounded w-60 ${label.color}`}
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
