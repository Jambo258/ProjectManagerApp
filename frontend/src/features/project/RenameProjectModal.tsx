import { useState} from "react";
import { X } from "react-feather";
import { useForm } from "react-hook-form";


interface RenameProjectFormValues {
  projectName: string;
}

export const RenameProjectModal = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const {
    register,
  } = useForm<RenameProjectFormValues>({
    defaultValues: {
      projectName: "",
    }
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button type="button" className="heading-xs bg-grayscale-0 p-2 hover:bg-grayscale-0 min-w-max"
        onClick={openModal}>
        Rename project
      </button>
      {isModalOpen ? (
        <dialog className="min-w-fit flex flex-col justify-center items-left p-2 pb-4 overflow-x-hidden overflow-y-auto fixed inset-0 z-30 outline-none rounded focus:outline-none">
          <header className="w-full flex flex-col place-items-end mb-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-grayscale-0 p-1 hover:bg-grayscale-0 text-dark-font">
              <X size={20}/>
            </button>
            <h3 className="place-self-start heading-md text-dark-font">Rename project</h3>
          </header>
          <body className="w-fit mx-auto">
            <form>
              <label
                className="body-text-sm text-left text-dark-font block mb-6">
                Project name:
                <input
                  type="text"
                  {...register("projectName")}
                  placeholder="e.g. To do"
                  required
                  className="body-text-md py-1.5 px-4 mt-1 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50"
                />
                <p className="text-center body-text-xs text-caution-200 mt-1">Project name required</p>
              </label>
              <section className="flex">
                <button type="submit" className="w-full me-1 btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-caution-100 bg-caution-100 hover:bg-caution-200">Save</button>
                <button
                  type="reset"
                  onClick={closeModal}
                  className="w-full ms-1 btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-primary-200"
                >
                    Cancel
                </button>
              </section>
            </form>
          </body>
        </dialog>) : null
      }
    </>
  );
};
