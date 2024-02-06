import { useForm, SubmitHandler } from "react-hook-form";

interface IProps {
    action: (imageUrl: string) => boolean | void;
  }

  interface Input {
    imageUrl: string
  }

export const AddImageModal = ({ action }: IProps) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Input>();
  const onSubmit: SubmitHandler<Input> = (data) => {
    action(data.imageUrl);
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
            Embed link
          <input
            type="text"
            {...register("imageUrl", { required: true })}
            placeholder="Paste the image link..."
          />
          {errors.imageUrl && <p className="text-center body-text-xs text-caution-200 mt-1">This field is required</p>}
        </label>
        <input type="submit" />
      </form>
    </>
  );
};
