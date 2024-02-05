import { type Labels } from "./Kanban";
import { CreateLabelModal } from "./CreateLabelModal";
// import { Modal } from "../../components/Modal";
import { Square, CheckSquare } from "react-feather";
import { EditLabelModal } from "./EditLabelModal";
import { SubModal } from "./SubModal";
import { useState } from "react";

interface Props {
  label: Labels[];
  setLabel: React.Dispatch<React.SetStateAction<Labels[]>>;
  labels: Labels[];
  setIsModalsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalsOpen: boolean;
  createLabel: (name: string, color: string) => void;
  updateLabelStatus: (id: string | number, activeStatus: boolean) => void;
  editLabel: (id: string | number, name: string, color: string) => void;
  deleteLabel: (id: string | number) => void;
}

export const LabelModal = ({ label, setLabel, labels, setIsModalsOpen, isModalsOpen, createLabel, updateLabelStatus, editLabel, deleteLabel }: Props) => {
  console.log(isModalsOpen);
  const [state, setState] = useState(true);
  return (
    <>
      <div className="grid grid-flow-row gap-2 ">
        {label.map((elements: Labels) => (
          <div
            key={elements.id}
            className="grid grid-cols-4 justify-center items-center"
          >
            <div className="ml-16">
              {elements.active ? (
                <CheckSquare
                  onClick={() => {updateLabelStatus(elements.id, state); setState(!state);}}
                  size={24}
                ></CheckSquare>
              ) : (
                <Square
                  onClick={() => {updateLabelStatus(elements.id, state);
                    setState(!state);}}
                  size={24}
                ></Square>
              )}
            </div>
            <div
              className={`col-span-2 py-1.5 text-center body-text-sm rounded-sm ${elements.color}`}
            >
              {elements.name}
            </div>

            <SubModal
              // btnText={<Edit2></Edit2>}
              iconName="Edit"
              modalTitle={"Edit Label"}
              setIsModalsOpen={setIsModalsOpen}
              isModalsOpen={isModalsOpen}
            >
              <EditLabelModal
                element={elements}
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
