import { useContext, useState } from "react";
import { ColorModal } from "./ColorModal";
import { Labels } from "./Kanban";
// import { ModalContext } from "../../components/Modal";
import { FieldErrors, useForm } from "react-hook-form";
import { createLabelSchema } from "./labelValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { subModalContext } from "./SubModal";

interface ColorProps {
  label: Labels[];
  setLabel: React.Dispatch<React.SetStateAction<Labels[]>>;
  labels: Labels[];
}

export interface CreateLabelFormValues {
  name: string;
  color: string;
}

export const CreateLabelModal = ({
  label,
  setLabel,
  labels,
}: ColorProps) => {
  // const { closeModal } = useContext(ModalContext);
  const { closeModal } = useContext(subModalContext);
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

  const onError = (errors: FieldErrors<CreateLabelFormValues>) => {
    console.log("Form field errors:", errors);
  };
  const canSubmit = isDirty;

  const onHandleSubmit = (formData: CreateLabelFormValues) => {
    console.log(formData.color);
    if (canSubmit) {
      try {
        const newLabel: Labels = {
          id: Math.floor(Math.random() * 10001),
          name: formData.name,
          color: formData.color,
        };
        setLabel([...label, newLabel]);
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
        <label className="block mb-6 body-text-sm text-left text-dark-font">
          Title
          <input
            type="text"
            {...register("name")}
            placeholder="Title for Label"
            className="block w-full py-1.5 px-4 mt-1 body-text-md focus:outline-none focus:ring focus:ring-dark-blue-50"
          />
          <p className="mt-1 text-center body-text-xs text-caution-200">
            {errors.name?.message}
          </p>
        </label>
        <label className="block mb-6 body-text-sm text-left text-dark-font">
          Select a Color
          <p className="mt-1 text-center body-text-xs text-caution-200">
            {errors.color?.message}
          </p>
          <p className="mt-1 text-center body-text-xs text-caution-200">
            {formError}
          </p>
          <div className="grid grid-cols-3">
            {labels.map((element) => (
              <ColorModal
                key={element.id}
                setValue={setValue}
                label={element}
              ></ColorModal>
            ))}
          </div>
        </label>
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
