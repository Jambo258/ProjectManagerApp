import { useState } from "react";
import { useAddNewPageMutation } from "../api/apiSlice";
import { Plus, X } from "react-feather";

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
        <button type="button" className="w-full heading-xs bg-grayscale-0 p-2 hover:bg-grayscale-0 text-left"
          onClick={openModal}>
          Add page
        </button>
      )}

      {showModal && (
        <div
          onClick={() => closeModal()}
          className={`flex justify-center fixed inset-0 z-50 items-center transition-colors
           ${showModal ? "visible bg-dark-blue-100/20" : "invisible"}`}
        >
          <div className="relative w-[500px] h-[300px] my-6 mx-auto">
            <div
              onClick={(e) => e.stopPropagation()}
              className={`rounded-lg shadow p-2 transition-all bg-grayscale-100
              ${showModal ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
            >
              <div className="flex justify-end">
                <button
                  className="text-right bg-grayscale-0 p-2 hover:bg-grayscale-0"
                  onClick={() => closeModal()}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col m-4 ">
                <h1 className="flex justify-start heading-sm pb-4">
                  Add new page
                </h1>
                <label className="flex justify-start heading-xs ">
                  Page name
                </label>
                <input
                  type="text"
                  placeholder="Give a page name!"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  className="block w-full py-1.5 px-4 mt-1 body-text-md focus:outline-none focus:ring focus:ring-dark-blue-50"
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
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AddPage;
