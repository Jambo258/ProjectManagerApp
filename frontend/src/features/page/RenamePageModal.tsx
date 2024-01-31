// React
import { useState, useContext} from "react";

// Redux Toolkit
import { useEditPageMutation } from "../api/apiSlice";

// Hook Form and Yup
import { FieldErrors, useForm } from "react-hook-form";
import { pageNameSchema } from "./pageValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { DevTool } from "@hookform/devtools";

// Context
import { ModalContext } from "../../components/Modal";

interface RenamePageFormValues {
  pageName: string;
}

interface RenamePageProps {
  pageId: number;
  pageName: string | null;
}

export const RenamePageModal = ( {pageId, pageName }: RenamePageProps) => {
  const [editPage, { isLoading }] = useEditPageMutation();
  const {closeModal} = useContext(ModalContext);
  const [formError, setFormError] = useState<null | string>(null);

  const {
    control,
    register,
    formState: {isDirty, errors},
    handleSubmit,
  } = useForm<RenamePageFormValues>({
    defaultValues: {
      pageName: pageName,
    },
    resolver: yupResolver(pageNameSchema)
  });

  const onError = (errors: FieldErrors<RenamePageFormValues>) => {
    console.log("Form field errors:", errors);
  };

  const onHandleSubmit = async (formData: RenamePageFormValues) => {
    if (!isDirty) {
      closeModal();
    } else if (!isLoading) {
      try {
        const page = await editPage({ id: pageId, name: formData.pageName }).unwrap();
        // For development purposes
        console.log("Form submitted");
        console.log("Page:", page);
        if (page) {
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
                Page name:
          <input
            type="text"
            {...register("pageName")}
            placeholder="e.g. To do"
            className="block w-full py-1.5 px-4 mt-1 body-text-md focus:outline-none focus:ring focus:ring-dark-blue-50"
          />
          <p className="mt-1 body-text-xs text-center text-caution-200">{errors.pageName?.message}</p>
          <p className="mt-1 body-text-xs text-center text-caution-200">{formError}</p>
        </label>
        <section className="grid grid-cols-2 gap-6">
          <button
            type="submit"
            className="w-full py-2 btn-text-sm bg-success-100 hover:bg-success-200"
          >
            Save Changes
          </button>
          <button
            type="reset"
            onClick={closeModal}
            className="w-full py-2 btn-text-sm bg-primary-100 hover:bg-primary-200"
          >
            Cancel Changes
          </button>
        </section>
      </form>

      {/* For development only */}
      <DevTool control={control}/>
    </>
  );
};
