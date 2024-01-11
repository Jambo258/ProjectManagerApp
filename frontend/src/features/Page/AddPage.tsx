import { useState } from "react";
import { useAddNewPageMutation } from "../api/apiSlice";
import { Plus } from "react-feather";

const AddPage = ({
  projectid,
  buttonSelector,
}: {
  projectid: number;
  buttonSelector: string;
}) => {
  const [addNewPage] = useAddNewPageMutation();
  const [pageName, setPageName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPageName("");
  };

  const createNewPage = async () => {
    try {
      if (!pageName) throw "missing page name";
      await addNewPage({
        projectid: projectid,
        pageName: pageName,
        content: [{}],
      }).unwrap();
      setPageName("");
      closeModal();
    } catch (error) {
      console.error("failed to create a new page,", error);
    }
  };

  return (
    <>
      {buttonSelector === "plus" ? (
        <button
          className="rounded-full p-1.5 heading-md"
          onClick={() => openModal()}
        >
          <Plus size={16} />
        </button>
      ) : (
        <section className="py-1 ps-1 pe-4" onClick={() => openModal()}>
          Add page
        </section>
      )}

      {showModal ? (
        <div
          onClick={() => closeModal()}
          className={`flex justify-center fixed inset-0 z-50 items-center transition-colors ${
            showModal ? "visible bg-dark-blue-100/20" : "invisible"
          }`}
        >
          <div className="relative w-[500px] h-[300px] my-6 mx-auto">
            <div
              onClick={(e) => e.stopPropagation()}
              className={`rounded-lg shadow p-2 transition-all bg-grayscale-100  ${
                showModal ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
            >
              <div className="flex flex-col px-4 ">
                <div className="flex justify-end">
                  <button
                    className="flex justify-end w-12 bg-grayscale-0 px-2 py-2 hover:bg-grayscale-0"
                    onClick={() => closeModal()}
                  >
                    x
                  </button>
                </div>
                <h1 className="flex justify-start heading-sm pb-4">
                  Add new page
                </h1>
                <label className="flex justify-start heading-sm ">
                  Page name
                </label>
                <input
                  type="text"
                  placeholder="Give a page name!"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                />

                <div className="my-4 flex justify-between">
                  <button
                    className="btn-text-md bg-success-100 w-48 hover:bg-success-200"
                    onClick={() => createNewPage()}
                  >
                    Add page
                  </button>
                  <button
                    className="btn-text-md  w-48 "
                    onClick={() => closeModal()}
                  >
                    cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default AddPage;
