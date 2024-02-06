import { Task, type Labels } from "./Kanban";
import { CreateLabelModal } from "./CreateLabelModal";
import { Square, CheckSquare } from "react-feather";
import { EditLabelModal } from "./EditLabelModal";
import { SubModal } from "./SubModal";

interface Props {
  task: Task;
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

export const LabelModal = ({
  label,
  setLabel,
  labels,
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
  console.log(label);
  console.log(task.labels?.length);
  const taskLabelIds = task.labels?.map(label => label.id) ?? [];
  return (
    <>
      <div className="grid grid-flow-row gap-2 ">
        {label.map((element: Labels) => (
          <div
            key={element.id}
            className="grid grid-cols-4 justify-center items-center"
          >
            <div className="ml-16">
              {taskLabelIds.includes(element.id)  ? (
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
              // btnText={<Edit2></Edit2>}
              iconName="Edit"
              modalTitle={"Edit Label"}
              setIsModalsOpen={setIsModalsOpen}
              isModalsOpen={isModalsOpen}
            >
              <EditLabelModal
                task={task}
                element={element}
                label={label}
                labels={labels}
                setLabel={setLabel}
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
            label={label}
            labels={labels}
            setLabel={setLabel}
            createLabel={createLabel}
          />
        </SubModal>
      </section>
    </>
  );
};
