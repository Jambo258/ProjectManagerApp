// React
import { useState, useContext } from "react";

// Redux Toolkit
import { useEditProjectMutation } from "../api/apiSlice";

// Hook Form and Yup
import { FieldErrors, useForm } from "react-hook-form";
import { projectNameSchema } from "./projectValidation";
import { yupResolver } from "@hookform/resolvers/yup";

// Context
import { ModalContext } from "../../components/Modal";

interface RenameProjectFormValues {
  projectName: string;
}

interface RenameProjectProps {
  projectId: number;
  projectName: string;
}

export const RenameProjectModal = ( {projectId, projectName }: RenameProjectProps) => {
  const [editProject, { isLoading }] = useEditProjectMutation();
  const {closeModal} = useContext(ModalContext);
  const [formError, setFormError] = useState<null | string>(null);
  const {
    register,
    formState: {isDirty, errors},
    handleSubmit,
  } = useForm<RenameProjectFormValues>({
    defaultValues: {
      projectName: projectName,
    },
    resolver: yupResolver(projectNameSchema)
  });

  const onError = (errors: FieldErrors<RenameProjectFormValues>) => {
    console.error("Form field errors:", errors);
  };

  const onHandleSubmit = async (formData: RenameProjectFormValues) => {
    if (!isDirty) {
      closeModal();
    } else if (!isLoading) {
      try {
        const project = await editProject({ id: projectId, name: formData.projectName }).unwrap();
        if (project) {
          closeModal();
        }
      }
      catch (err) {
        onError;
        console.error("Failed to save the user", err);
        // TO DO: Refactor this
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
      <form
        onSubmit={handleSubmit(onHandleSubmit, onError)}
        noValidate
      >
        <label
          className="block mb-6 body-text-sm text-left text-dark-font">
                Project name:
          <input
            type="text"
            {...register("projectName")}
            autoFocus
            placeholder="e.g. To do"
            className="block w-full py-1.5 px-4 mt-1 body-text-md"
          />
          <p className="mt-1 body-text-xs text-center text-caution-200">{errors.projectName?.message}</p>
          <p className="mt-1 body-text-xs text-center text-caution-200">{formError}</p>
        </label>
        <section className="grid grid-cols-2 gap-6">
          <button
            type="submit"
            className="w-full py-2 btn-text-sm bg-success-100 hover:bg-success-200"
          >
            Save changes
          </button>
          <button
            type="reset"
            onClick={closeModal}
            className="w-full py-2 btn-text-sm bg-primary-100 hover:bg-primary-200"
          >
            Cancel
          </button>
        </section>
      </form>
    </>
  );
};
