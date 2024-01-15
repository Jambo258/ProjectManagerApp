// React
import { useState} from "react";

// Redux Toolkit
import { useEditProjectMutation } from "../api/apiSlice";

// Hook Form and Yup
import { FieldErrors, useForm } from "react-hook-form";
import { renameProjectSchema } from "./projectValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { DevTool } from "@hookform/devtools";

interface RenameProjectFormValues {
  projectName: string;
}

interface RenameProjectProps {
  projectId: number;
  projectName: string;
  closeModal?: () => void;
}

export const RenameProjectModal = ( {projectId, projectName, closeModal }: RenameProjectProps) => {
  const [editProject, { isLoading }] = useEditProjectMutation();
  const [formError, setFormError] = useState<null | string>(null);
  const {
    control,
    register,
    formState: {isDirty, errors},
    handleSubmit,
  } = useForm<RenameProjectFormValues>({
    defaultValues: {
      projectName: projectName,
    },
    resolver: yupResolver(renameProjectSchema)
  });

  const onError = (errors: FieldErrors<RenameProjectFormValues>) => {
    console.log("Form field errors:", errors);
  };

  const onHandleSubmit = async (formData: RenameProjectFormValues) => {
    if (!isDirty) {
      closeModal!();
    } else if (!isLoading) {
      try {
        const project = await editProject({ id: projectId, name: formData.projectName }).unwrap();
        // For development purposes
        console.log("Form submitted");
        console.log("Project:", project);
        if (project) {
          closeModal!();
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
            placeholder="e.g. To do"
            className="block w-full py-1.5 px-4 mt-1 body-text-md focus:outline-none focus:ring focus:ring-dark-blue-50"
          />
          <p className="mt-1 body-text-xs text-center text-caution-200">{errors.projectName?.message}</p>
          <p className="mt-1 body-text-xs text-center text-caution-200">{formError}</p>
        </label>
        <section className="flex">
          <button
            type="submit"
            className="w-full me-6 py-2 btn-text-sm bg-success-100 hover:bg-success-200"
          >
            Save
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

      {/* For development only */}
      <DevTool control={control}/>
    </>
  );
};
