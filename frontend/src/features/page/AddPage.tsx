// React
import { useState } from "react";

// Redux Toolkit
import { useAddNewPageMutation } from "../api/apiSlice";

// Hook Form and Yup
import { FieldErrors, useForm } from "react-hook-form";
import { pageNameSchema } from "./pageValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { DevTool } from "@hookform/devtools";

interface AddPageFormValues {
  pageName: string;
}

const AddPage = ({ projectId, closeModal }: { projectId: number; closeModal?: () => void; }) => {
  const [addNewPage, { isLoading }] = useAddNewPageMutation();
  const [formError, setFormError] = useState<null | string>(null);
  const {
    control,
    register,
    formState: {isDirty, errors},
    handleSubmit,
  } = useForm<AddPageFormValues>({
    resolver: yupResolver(pageNameSchema)
  });

  const onError = (errors: FieldErrors<AddPageFormValues>) => {
    console.log("Form field errors:", errors);
  };

  const canSave = isDirty && !isLoading;

  const createNewPage = async (formData: AddPageFormValues) => {
    if (canSave) {
      try {
        // if (!pageName) throw "missing page name";
        const page = await addNewPage({
          projectid: projectId,
          pageName: formData.pageName,
          content: [{}],
        }).unwrap();
        // For development purposes
        console.log("Form submitted");
        console.log("Page:", page);
        if (page) {
          closeModal!();
        }
      } catch (err) {
        onError;
        console.error("failed to create a new page,", err);
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
        onSubmit={handleSubmit(createNewPage, onError)}
        noValidate>
        <label
          className="block mb-6 body-text-sm text-left text-dark-font">
            Page name:
          <input
            type="text"
            {...register("pageName")}
            placeholder="Give a page name!"
            className="block w-full py-1.5 px-4 mt-1 body-text-md focus:outline-none focus:ring focus:ring-dark-blue-50"
          />
          <p className="mt-1 body-text-xs text-center text-caution-200">{errors.pageName?.message}</p>
          <p className="mt-1 body-text-xs text-center text-caution-200">{formError}</p>
        </label>
        <section className="grid grid-cols-2 gap-6">
          <button
            type="submit"
            className="w-full py-2 btn-text-sm bg-success-100 hover:bg-success-200">
              Save
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
export default AddPage;
