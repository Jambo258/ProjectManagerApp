// React
import { useState, useContext } from "react";

// Redux Toolkit
import { useAddNewPageMutation } from "../api/apiSlice";

// Hook Form and Yup
import { FieldErrors, useForm } from "react-hook-form";
import { pageNameSchema } from "./pageValidation";
import { yupResolver } from "@hookform/resolvers/yup";

// Context
import { ModalContext } from "../../components/Modal";

// React Router
import { useNavigate } from "react-router-dom";

interface AddPageFormValues {
  pageName: string;
}

export const AddPageModal = ({ projectId }: { projectId: number; }) => {
  const navigate = useNavigate();

  const [addNewPage, { isLoading }] = useAddNewPageMutation();
  const {closeModal} = useContext(ModalContext);
  const [formError, setFormError] = useState<null | string>(null);
  const {
    register,
    formState: {isDirty, errors},
    handleSubmit,
  } = useForm<AddPageFormValues>({
    resolver: yupResolver(pageNameSchema)
  });

  const onError = (errors: FieldErrors<AddPageFormValues>) => {
    console.error("Form field errors:", errors);
  };

  const canSave = isDirty && !isLoading;

  const createNewPage = async (formData: AddPageFormValues) => {
    if (canSave) {
      try {
        const page = await addNewPage({
          projectid: projectId,
          pageName: formData.pageName,
        }).unwrap();
        if (page) {
          closeModal();
          navigate(`/projects/${projectId}/${page.id}`);
        }
      } catch (err) {
        onError;
        console.error("failed to create a new page,", err);
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
        onSubmit={handleSubmit(createNewPage, onError)}
        noValidate>
        <label
          className="block mb-6 body-text-sm text-left text-dark-font">
            Page name:
          <input
            type="text"
            {...register("pageName")}
            autoFocus
            placeholder="Give a page name!"
            className="block w-full py-1.5 px-4 mt-1 body-text-md"
          />
          <p className="mt-1 body-text-xs text-center text-caution-200">
            {errors.pageName?.message}
          </p>
          <p className="mt-1 body-text-xs text-center text-caution-200">
            {formError}
          </p>
        </label>
        <section className="grid grid-cols-2 gap-6">
          <button
            type="submit"
            className="w-full py-2 btn-text-sm bg-success-100 hover:bg-success-200">
              Add page
          </button>
          <button
            type="reset"
            onClick={closeModal}
            className="w-full py-2 btn-text-sm bg-primary-100 hover:bg-primary-200">
              Cancel
          </button>
        </section>
      </form>
    </>
  );
};
