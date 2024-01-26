import { Label } from "./DnDComponent";

interface ColorProps {
  label: Label;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}
export const ColorModal = ({ label, setColor }: ColorProps) => {
  const HandleChange = () => {
    setColor(label.color);
  };

  return (
    <button
      onClick={() => HandleChange()}
      className={`h-12 m-1 rounded-md ${label.color}`}
      type="button"
    ></button>
  );
};
