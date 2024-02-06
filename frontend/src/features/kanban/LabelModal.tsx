import { Task, type Labels } from "./Kanban";
import { CreateLabelModal } from "./CreateLabelModal";
import { Square, CheckSquare } from "react-feather";
import { EditLabelModal } from "./EditLabelModal";
import { SubModal } from "./SubModal";

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
  console.log(isModalsOpen);
  console.log(task);
  console.log(labels);
  console.log(task.labels?.length);
  const taskLabelIds = task.labels?.map((label) => label.id) ?? [];
  return (
    <>
      <div className="grid grid-flow-row gap-2 ">
        {labels.map((element: Labels) => (
          <div
            key={element.id}
            className="grid grid-cols-4 justify-center items-center"
          >
            <div className="ml-16">
              {taskLabelIds.includes(element.id) ? (
                <CheckSquare
                  onClick={() => {
                    deleteLabelStatus(task.Id, element.id.toString());
                  }}
                  size={24}
                ></CheckSquare>
              ) : (
                <Square
                  onClick={() => {
                    updateLabelStatus(task.Id, element.id.toString());
                  }}
                  size={24}
                ></Square>
              )}
            </div>
            <div
              className={`col-span-2 py-1.5 text-center body-text-sm rounded-sm ${element.color}`}
            >
              {element.name}
            </div>

            <SubModal
              iconName="Edit"
              modalTitle={"Edit Label"}
              setIsModalsOpen={setIsModalsOpen}
              isModalsOpen={isModalsOpen}
            >
              <EditLabelModal
                task={task}
                element={element}
                label={labels}
                labels={labelColors}
                editLabel={editLabel}
                deleteLabel={deleteLabel}
              />
            </SubModal>
          </div>
        ))}
      </div>
      <section className="grid grid-cols mt-4">
        <SubModal
          iconName="none"
          btnText={"Create new Label"}
          modalTitle={"Create Label"}
          setIsModalsOpen={setIsModalsOpen}
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
