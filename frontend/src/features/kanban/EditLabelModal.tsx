import { useContext, useState } from "react";
import { Labels } from "./Kanban";
// import { ModalContext } from "../../components/Modal";
import { CreateLabelFormValues } from "./CreateLabelModal";
import { ColorModal } from "./ColorModal";
import { FieldErrors, useForm } from "react-hook-form";
import { createLabelSchema } from "./labelValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubModalContext } from "./SubModal";

interface ColorProps {
  label: Labels[];
  setLabel: React.Dispatch<React.SetStateAction<Labels[]>>;
  labels: Labels[];
  element: Labels;
  editLabel: (id: string | number, name: string, color: string) => void;
  deleteLabel: (id: string | number) => void;
}

export const EditLabelModal = ({ labels, element, editLabel, deleteLabel }: ColorProps) => {
  // const { closeModal } = useContext(ModalContext);
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

  const onError = (errors: FieldErrors<CreateLabelFormValues>) => {
    console.log("Form field errors:", errors);
  };
  const canSubmit = isDirty;

  const onHandleSubmit = (formData: CreateLabelFormValues) => {
    console.log(formData.color);
    if (canSubmit) {
      try {
        editLabel(element.id, formData.name, formData.color);
        /*
        setLabel((prev) =>
          prev.map((elements) => {
            if (elements.id === element.id) {
              return {
                ...elements,
                name: formData.name,
                color: formData.color,
              };
            }
            return elements;
          })
        );
        */
        closeModal();
        reset();
        setFormError(null);
      } catch (err) {
        onError;
        console.error("Failed to update label", err);
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

  const onHandleDelete = () => {
    try {
      deleteLabel(element.id);
      // setLabel((prev) => prev.filter((elements) => elements.id !== element.id));
      closeModal();
      reset();
      setFormError(null);
    } catch (err) {
      onError;
      console.error("Failed to delete label", err);
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
  };

  return (
    <>
      <form>
        <label className="block mb-3.5 heading-xs text-left text-dark-font">
          Title
          <input
            type="text"
            {...register("name")}
            placeholder={element.name}
            className="block w-full body-text-sm py-1 px-2 mt-1.5 border-grayscale-300"
          />
          <p className="mt-1 text-center body-text-xs text-caution-200">
            {errors.name?.message}
          </p>
        </label>
        <label className="block heading-xs text-left text-dark-font">
          Select a Color
          <p className="mt-1 text-center body-text-xs text-caution-200">
            {errors.color?.message}
          </p>
          <p className="mt-1 text-center body-text-xs text-caution-200">
            {formError}
          </p>
        </label>
        <div className="grid grid-cols-3 gap-2 mt-1.5">
          {labels.map((element) => (
            <ColorModal
              key={element.id}
              setValue={setValue}
              label={element}
            ></ColorModal>
          ))}
        </div>
        <section className="border grid grid-cols-2 gap-6 mt-3.5">
          <button
            onClick={handleSubmit(onHandleSubmit, onError)}
            name="save"
            className="py-2 btn-text-xs bg-success-100 hover:bg-success-200"
          >
            Save
          </button>
          <button
            onClick={onHandleDelete}
            name="delete"
            className="py-2 btn-text-xs bg-caution-100 hover:bg-caution-200"
          >
            Delete
          </button>
        </section>
      </form>
    </>
  );
};
