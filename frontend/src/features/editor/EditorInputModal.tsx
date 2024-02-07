import { useState } from "react";
import { Image, Link, X } from "react-feather";
import { useForm } from "react-hook-form";
import useScreenDimensions from "../../utils/screenDimensions";

type IconType = "Image"| "Link";

interface IProps {
    iconName: IconType;
    title: string;
    modalTitle: string;
    modalText: string
    action: (url: string) => void;
}

interface Input {
    url: string;
}

export const EditorInputModal = ({ iconName, title, modalTitle, modalText, action }: IProps) => {
  const {
    formState: { errors, isSubmitting, },
    handleSubmit,
    register,
    reset,
  } = useForm<Input>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const screenDimensions = useScreenDimensions();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getIconFromName = (iconName: IconType) => {
    switch (iconName) {
    case "Image":
      return <Image size={20} />;
    case "Link":
      return <Link size={20} />;
    }
  };

  const onSubmit = handleSubmit((formData: Input) => {
    action(formData.url);
    reset();
    closeModal();
  });

  return (
    <>
      <button
        title={title}
        onClick={() => setIsModalOpen(true)}
        className="p-1 bg-grayscale-0"
      >
        {getIconFromName(iconName)}
      </button>

      {isModalOpen &&
      <div
        onClick={closeModal}
        className={`fixed flex justify-center inset-0 z-30 items-center transition-colors ${isModalOpen ? "visible bg-dark-blue-100/40" : "invisible"}`}>
        <dialog
          onClick={(e) => e.stopPropagation()}
          className={`fixed p-2 pb-4 flex flex-col inset-0 z-30 max-h-screen sm:justify-start items-left overflow-x-hidden overflow-y-auto outline-none sm:rounded focus:outline-none shadow transition-all
          ${screenDimensions.height < 500 ? "min-h-screen w-full" : "w-full h-full sm:h-fit sm:w-fit sm:max-w-sm"}`}>

          <header className="w-full flex flex-row justify-between items-center mb-4">
            <h4 className="m-auto pl-3 sm:pl-2.5 place-self-center heading-sm text-dark-font">
              {modalTitle}
            </h4>
            <button
              onClick={closeModal}
              className="p-1 mb-1 h-fit text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
            >
              <X />
            </button>
          </header>

          <main className="w-full mx-auto px-2">
            <p className="mb-3 body-text-sm">{modalText}</p>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                {...register("url", { required: true })}
                placeholder={`Paste the ${title.toLowerCase()}'s url...`}
                aria-label="URL"
                className="body-text-md py-1.5 px-4 mt-1 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50"
              />
              {errors.url && <p className="text-center body-text-xs text-caution-200 mt-1">This field is required</p>}
              <button type="submit" disabled={isSubmitting} className="w-full mt-4 btn-text-sm focus:outline-none focus:ring focus:ring-dark-blue-50">
                {`Add ${title.toLowerCase()}`}
              </button>
            </form>
          </main>

        </dialog>
      </div>
      }
    </>
  );
};
