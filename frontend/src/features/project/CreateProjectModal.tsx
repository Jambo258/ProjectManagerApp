// React
import { useContext, useState } from "react";

// Redux Toolkit
import { useAddNewProjectMutation } from "../api/apiSlice";

// Hook Form and Yup
import { FieldErrors, useForm } from "react-hook-form";
import { projectNameSchema } from "./projectValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { DevTool } from "@hookform/devtools";

// Context
import { ModalContext } from "../../components/Modal";

// React Router
import { useNavigate } from "react-router-dom";

interface CreateProjectFormValues {
  projectName: string;
}

const CreateProjectModal = () => {
  const navigate = useNavigate();

  const [addNewProject, { isLoading }] = useAddNewProjectMutation();
  const {closeModal} = useContext(ModalContext);
  const [formError, setFormError] = useState<null | string>(null);
  const {
    control,
    register,
    formState: {isDirty, errors},
    handleSubmit,
  } = useForm<CreateProjectFormValues>({
    resolver: yupResolver(projectNameSchema)
  });

  const onError = (errors: FieldErrors<CreateProjectFormValues>) => {
    console.log("Form field errors:", errors);
  };

  const canSave = isDirty && !isLoading;

  const newProject = async (formData: CreateProjectFormValues) => {
    if (canSave) {
      try {
        const project = await addNewProject(formData.projectName).unwrap();
        // For development purposes
        console.log("Form submitted");
        console.log("Project:", project);
        if (project) {
          closeModal();
          navigate(`projects/${project.id}`, { replace: true });
        }
      } catch (err) {
        onError;
        console.error("failed to create project", err);
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
        onSubmit={handleSubmit(newProject, onError)}
        noValidate>
        <label
          className="block mb-6 body-text-sm text-left text-dark-font">
            Project name:
          <input
            type="text"
            {...register("projectName")}
            placeholder="Give a project name!"
            className="block w-full py-1.5 px-4 mt-1 body-text-md focus:outline-none focus:ring focus:ring-dark-blue-50"
          />
          <p className="mt-1 body-text-xs text-center text-caution-200">{errors.projectName?.message}</p>
          <p className="mt-1 body-text-xs text-center text-caution-200">{formError}</p>
        </label>
        <section className="grid grid-cols-2 gap-6">
          <button
            type="submit"
            className="w-full py-2 btn-text-sm bg-success-100 hover:bg-success-200">
              Add Project
          </button>
          <button
            type="reset"
            onClick={closeModal}
            className="w-full py-2 btn-text-sm bg-primary-100 hover:bg-primary-200">
              Cancel
          </button>
        </section>
      </form>

      {/* For development only */}
      <DevTool control={control}/>
    </>
  );
};

export default CreateProjectModal;
