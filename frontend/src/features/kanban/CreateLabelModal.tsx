import { useContext, useState } from "react";
import { ColorModal } from "./ColorModal";
import type { Labels } from "./Kanban";
import { FieldErrors, useForm } from "react-hook-form";
import { createLabelSchema } from "./labelValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubModalContext } from "./SubModal";

interface ColorProps {
  labelColors: Labels[];
  createLabel: (name: string, color: string) => void;
}

export interface CreateLabelFormValues {
  name: string;
  color: string;
}

export const CreateLabelModal = ({
  labelColors,
  createLabel
}: ColorProps) => {
  const { closeModal } = useContext(SubModalContext);
  const {
    formState: { isDirty, errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<CreateLabelFormValues>({
    defaultValues: {
      name: "",
      color: "",
    },
    resolver: yupResolver(createLabelSchema),
  });

  const [formError, setFormError] = useState<null | string>(null);

  const [selectedColor, setSelectedColor] = useState<string>("");

  const onError = (errors: FieldErrors<CreateLabelFormValues>) => {
    console.error("Form field errors:", errors);
  };
  const canSubmit = isDirty;

  const onHandleSubmit = (formData: CreateLabelFormValues) => {
    if (canSubmit) {
      try {
        createLabel(formData.name, formData.color);
        closeModal();
        reset();
        setFormError(null);
      } catch (err) {
        onError;
        console.error("Failed to create label", err);
        if (
          err &&
          typeof err === "object" &&
          "data" in err &&
          err.data &&
          typeof err.data === "object"
        ) {
          const errorMessage = Object.values(err.data);
          setFormError(errorMessage.toString());
        }
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onHandleSubmit, onError)}>
        <label className="block mb-3.5 heading-xs text-left text-dark-font">
          Title
          <input
            type="text"
            {...register("name")}
            autoFocus
            placeholder="Title for label"
            className="block w-full body-text-sm py-1 px-2 mt-1.5 border-grayscale-300"
          />
          <p className="mt-1 text-center body-text-xs text-caution-200">
            {errors.name?.message}
          </p>
        </label>
        <label className="block heading-xs text-left text-dark-font">
          Select a color
          <p className="mt-1 text-center body-text-xs text-caution-200">
            {errors.color?.message}
          </p>
          <p className="mt-1 text-center body-text-xs text-caution-200">
            {formError}
          </p>
        </label>
        <div className="grid grid-cols-3 gap-2 mt-1.5">
          {labelColors.map((label) => (
            <div key={label.id}
              className={label.color === selectedColor ? "outline outline-grayscale-400 rounded" : ""}
              onClick={() => setSelectedColor(label.color)}>
              <ColorModal
                setValue={setValue}
                label={label}
              />
            </div>
          ))}
        </div>
        <section className="grid grid-cols">
          <button
            type="submit"
            className="py-2 my-2 btn-text-xs bg-greyscale-100 hover:bg-greyscale-200 mt-6"
          >
            Create label
          </button>
        </section>
      </form>
    </>
  );
};
