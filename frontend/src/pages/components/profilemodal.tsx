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
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex justify-end">
                  <button
                    className="w-12 bg-grayscale-0 px-2 py-2"
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
          </div>
        </>
      ) : null}
    </>
  );
};

