// React
import { useState} from "react";

// Redux Toolkit
import { useEditProjectMutation } from "../api/apiSlice";

// Hook Form and Yup
import { FieldErrors, useForm } from "react-hook-form";
import { renameProjectSchema } from "./projectValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { DevTool } from "@hookform/devtools";

// Components
import { X } from "react-feather";

interface RenameProjectFormValues {
  projectName: string;
}

export const RenameProjectModal = () => {
  const [editProject, { isLoading }] = useEditProjectMutation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<null | string>(null);
  const {
    control,
    register,
    formState: {isDirty, errors},
    handleSubmit,
  } = useForm<RenameProjectFormValues>({
    defaultValues: {
      projectName: "",
    },
    resolver: yupResolver(renameProjectSchema)
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onError = (errors: FieldErrors<RenameProjectFormValues>) => {
    console.log("Form field errors:", errors);
  };

  const canSubmit = isDirty && !isLoading;

  const onHandleSubmit = async (formData: RenameProjectFormValues) => {
    if (canSubmit) {
      try {
        const project = await editProject({ id:1, name: formData.projectName }).unwrap();

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
      <button type="button" className="min-w-max p-1.5 heading-xs bg-grayscale-0 hover:bg-grayscale-0"
        onClick={openModal}>
        Rename project
      </button>
      {isModalOpen &&
        <section
          onClick={() => closeModal()}
          className={`fixed flex justify-center inset-0 z-30 items-center transition-colors ${
            isModalOpen ? "visible bg-dark-blue-100/40" : "invisible"
          }`}
        >
          <dialog
            onClick={(e) => e.stopPropagation()}
            className="fixed min-w-fit flex flex-col p-2 pb-4 inset-0 z-30 justify-center items-left overflow-x-hidden overflow-y-auto outline-none rounded focus:outline-none">
            <header className="w-full flex flex-col mb-4 place-items-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-dark-font bg-grayscale-0 hover:bg-grayscale-0">
                <X size={20}/>
              </button>
              <h3 className="place-self-start heading-md text-dark-font">Rename project</h3>
            </header>
            <main className="w-fit mx-auto">
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
                    className="w-full me-1 px-4 py-1.5 btn-text-xs outline-none focus:outline focus:outline-success-100 bg-success-100 hover:bg-success-200"
                  >
                  Save
                  </button>
                  <button
                    type="reset"
                    onClick={closeModal}
                    className="w-full ms-1 btn-text-xs px-4 py-1.5 outline-none focus:outlinefocus:outline-caution-100 bg-caution-100 hover:bg-caution-200"
                  >
                    Cancel
                  </button>
                </section>
              </form>
            </main>
          </dialog>
          {/* For development only */}
          <DevTool control={control}/>
        </section>
      }
    </>
  );
};
