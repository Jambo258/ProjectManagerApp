import { Label } from "./Kanban";
import { CreateLabelModal } from "./CreateLabelModal";
import { Modal } from "../../components/Modal";
import { Edit2 } from "react-feather";
import { Square } from "react-feather";
import { EditLabelModal } from "./EditLabelModal";

interface Props {
  label: Label[];
  setLabel: React.Dispatch<React.SetStateAction<Label[]>>;
  labels: Label[];
}

export const LabelModal = ({ label, setLabel, labels }: Props) => {
  return (
    <>
      <div className="grid grid-flow-row gap-2 ">
        {label.map((elements) => (
          <div
            key={elements.id}
            className="grid grid-cols-4 justify-center items-center"
          >
            <div className="ml-4">
              <Square size={16}></Square>
            </div>
            <div
              className={`col-span-2 text-center rounded-md ${elements.color}`}
            >
              {elements.name}
            </div>

            <Modal
              btnText={<Edit2 size={16} />}
              btnStyling={"bg-grayscale-0 hover:bg-grayscale-0"}
              modalTitle={"Edit Label"}
            >
              <EditLabelModal
                element={elements}
                label={label}
                labels={labels}
                setLabel={setLabel}
              />
            </Modal>
          </div>
        ))}
      </div>
      <section className="grid grid-cols mt-4">
        <Modal
          btnText={"Create new Label"}
          btnStyling={"mb-3 mx-2"}
          modalTitle={"Create Label"}
        >
          <CreateLabelModal label={label} labels={labels} setLabel={setLabel} />
        </Modal>
      </section>
    </>
  );
};
