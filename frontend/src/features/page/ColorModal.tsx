import { UseFormSetValue } from "react-hook-form";
import { Label } from "./DnDComponent";
import { CreateLabelFormValues } from "./CreateLabelModal";

interface ColorProps {
  label: Label;
  setValue: UseFormSetValue<CreateLabelFormValues>;
}
export const ColorModal = ({ label, setValue }: ColorProps) => {
  const HandleChange = () => {
    setValue("color", label.color, { shouldValidate: true });
  };

  return (
    <button
      onClick={() => HandleChange()}
      className={`h-12 m-1 rounded-md ${label.color}`}
      type="button"
    ></button>
  );
};
