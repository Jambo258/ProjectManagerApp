import { useState } from "react";
import { ProfileView } from "../views/profileView";

export const ProfileModal = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className="btn-text-xs px-4 py-1.5  outline-none focus:outline focus:outline-primary-200"
        type="button"
        onClick={() => setShowModal(!showModal)}
      >
        Show User Information
      </button>
      {showModal ? (
        <>
          <div
            className={`flex justify-center items-center fixed inset-0 transition-colors ${
              showModal ? "visible bg-dark-blue-100/20" : "invisible"
            }`}
          >
            <div
              className={`rounded-lg shadow p-2 transition-all bg-grayscale-100  ${
                showModal ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
            >
              <div className="flex justify-end">
                <button
                  className="w-12 bg-grayscale-0 px-2 py-2 hover:bg-grayscale-0"
                  onClick={() => setShowModal(false)}
                >
                  x
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <ProfileView></ProfileView>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};


