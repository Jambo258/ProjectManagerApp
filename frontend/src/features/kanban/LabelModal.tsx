import { type Labels } from "./Kanban";
import { CreateLabelModal } from "./CreateLabelModal";
// import { Modal } from "../../components/Modal";
import { Square } from "react-feather";
import { EditLabelModal } from "./EditLabelModal";
import { SubModal } from "./SubModal";

interface Props {
  label: Labels[];
  setLabel: React.Dispatch<React.SetStateAction<Labels[]>>;
  labels: Labels[];
  setIsModalsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalsOpen: boolean;
}

export const LabelModal = ({ label, setLabel, labels, setIsModalsOpen, isModalsOpen }: Props) => {
  console.log(isModalsOpen);
  return (
    <>
      <div className="grid grid-flow-row gap-2 ">
        {label.map((elements: Labels) => (
          <div
            key={elements.id}
            className="grid grid-cols-4 justify-center items-center"
          >
            <div className="ml-16">
              <Square size={24}></Square>
            </div>
            <div
              className={`col-span-2 text-center rounded-md ${elements.color}`}
            >
              {elements.name}
            </div>

            <SubModal
              btnText="Edit label"
              iconName="none"
              modalTitle={"Edit Label"}
              setIsModalsOpen={setIsModalsOpen}
              isModalsOpen={isModalsOpen}
            >
              <EditLabelModal
                element={elements}
                label={label}
                labels={labels}
                setLabel={setLabel}
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
          <CreateLabelModal label={label} labels={labels} setLabel={setLabel} />
        </SubModal>
      </section>
    </>
  );
};
