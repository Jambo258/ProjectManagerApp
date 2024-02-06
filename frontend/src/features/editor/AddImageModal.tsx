import { useForm } from "react-hook-form";

interface IProps {
    action: (imageUrl: string) => void;
  }

  interface Input {
    imageUrl: string;
  }

export const AddImageModal = ({ action }: IProps) => {
  const {
    formState: { errors, isSubmitting, },
    handleSubmit,
    register,
    reset,
  } = useForm<Input>();

  const onHandleSubmit = (formData: Input) => {
    action(formData.imageUrl);
    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <p className="mb-3 body-text-sm">To add images to the editor, type or paste the web address where the image is stored online. The address must end in an extension like .png, .gif, or .jpg.</p>
        <label
          className="heading-xs text-dark-font block mb-8">
            Image link
          <input
            type="text"
            {...register("imageUrl", { required: true })}
            placeholder="Paste the image link..."
            className="body-text-md py-1.5 px-4 mt-1 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50"
          />
          {errors.imageUrl && <p className="text-center body-text-xs text-caution-200 mt-1">This field is required</p>}
        </label>
        <button type="submit" disabled={isSubmitting} className="w-full btn-text-md focus:outline-none focus:ring focus:ring-dark-blue-50">
          Add image
        </button>
      </form>
    </>
  );
};
