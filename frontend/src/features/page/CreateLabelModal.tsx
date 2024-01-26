import { useContext, useState } from "react";
import { ColorModal } from "./ColorModal";
import { Label } from "./DnDComponent";
import { ModalContext } from "../../components/Modal";

interface ColorProps {
  label: Label[];
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setLabel: React.Dispatch<React.SetStateAction<Label[]>>;
  labels: Label[];
  color: string;
}

export const CreateLabelModal = ({
  label,
  setColor,
  setLabel,
  labels,
  color,
}: ColorProps) => {
  const [name, setName] = useState("");
  const { closeModal } = useContext(ModalContext);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newLabel: Label = {
      id: Math.floor(Math.random() * 10001),
      name,
      color,
    };
    setLabel([...label, newLabel]);
    closeModal();
  };
  return (
    <>
      <form onSubmit={(event) => handleSubmit(event)} noValidate>
        <label className="block mb-6 body-text-sm text-left text-dark-font">
          Title
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Title for Label"
            className="block w-full py-1.5 px-4 mt-1 body-text-md focus:outline-none focus:ring focus:ring-dark-blue-50"
          />
        </label>
        <label className="block mb-6 body-text-sm text-left text-dark-font">
          Select a Color
        </label>
        <div className="grid grid-cols-3">
          {labels.map((element) => (
            <ColorModal
              key={element.id}
              label={element}
              setColor={setColor}
            ></ColorModal>
          ))}
        </div>
        <section className="grid grid-cols">
          <button
            type="submit"
            className="py-2 my-2 btn-text-sm bg-greyscale-100 hover:bg-greyscale-200"
          >
            Create Label
          </button>
        </section>
      </form>
    </>
  );
};
