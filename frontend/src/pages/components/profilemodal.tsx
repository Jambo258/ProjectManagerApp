import { useState } from "react";
import { ProfileView } from "../views/profileView";

export const ProfileModal = () => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button className="bg-purple-200 hover:bg-purple-200 rounded-full m-0 p-0 w-8 h-8 text-light-font text-center heading-sm leading-8" 
        onClick={() => setShowModal(!showModal)}>
            A
      </button>
      {showModal ? (
        <>
          <div
            className={`z-10 flex justify-center items-center fixed inset-0 transition-colors ${
              showModal ? "visible bg-dark-blue-100/40" : "invisible"}`}
            onClick={() => closeModal()}
          >
            <div
              className={`flex-none rounded-lg shadow p-2 transition-all bg-grayscale-100 text-dark-font  ${
                showModal ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end">
                <button
                  className="w-12 bg-grayscale-0 px-2 py-2 hover:bg-grayscale-0"
                  onClick={() => closeModal()}
                >
                  x
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <ProfileView />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};


