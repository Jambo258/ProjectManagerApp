import { useState } from "react";
import { DeleteModal } from "../components/deleteModal";

export const ProfileView = () => {
  const [nameEdit, setNameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const deleteModalText = "Are you sure you want to delete account?";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted");
  };

  const handleSubmitForModal = () => {
    console.log("Submitted");
  };

  return (
    <>
      <div className="grid grid-flow-row max-w-2xl m-auto gap-x-3 body-text-md">
        <div className="heading-xl col-span-4 mt-4">Account settings</div>
        <div className="col-span-3 my-4">
          <p className="font-semibold heading-xs">Name</p>
          <p className="">Beerit Käppänä</p>
        </div>
        <button
          onClick={() => {
            setNameEdit(!nameEdit);
            setEmailEdit(false);
            setPasswordEdit(false);
          }}
          className="my-4 col-span-1 btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-primary-200"
        >
          Change Name
        </button>
        {nameEdit && (
          <div className="col-span-3">
            <form onSubmit={handleSubmit} className="">
              <label htmlFor="nameInput" className="">
                Name
              </label>
              <input
                id="nameInput"
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                required
                className="body-text-md py-1.5 px-4 mb-3 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50"
              />
              <button
                type="submit"
                className="my-4 col-span-1 btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-primary-200"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        <div className="col-span-3 my-4">
          <p className="font-semibold heading-xs">Email</p>
          <p className="">beerit.kappana@mail.com</p>
        </div>
        <button
          onClick={() => {
            setNameEdit(false);
            setEmailEdit(!emailEdit);
            setPasswordEdit(false);
          }}
          className="my-4 col-span-1 btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-primary-200"
        >
          Change Email
        </button>
        {emailEdit && (
          <div className="col-span-3">
            <form onSubmit={handleSubmit} className="">
              <label htmlFor="emailInput" className="">
                Email
              </label>
              <input
                id="emailInput"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
                className="body-text-md py-1.5 px-4 mb-3 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50"
              />
              <button
                type="submit"
                className="my-4 col-span-1 btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-primary-200"
              >
                Submit
              </button>
            </form>
          </div>
        )}
        <div className="col-span-3 my-4">
          <p className="font-semibold heading-xs">Password</p>
          <p className="">Set a permanent password to login to your account</p>
        </div>
        <button
          onClick={() => {
            setNameEdit(false);
            setEmailEdit(false);
            setPasswordEdit(!passwordEdit);
          }}
          className="my-4 col-span-1 btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-primary-200"
        >
          Change Password
        </button>
        {passwordEdit && (
          <div className="col-span-3">
            <form onSubmit={handleSubmit} className="">
              <label htmlFor="passwordInput" className="">
                Password
              </label>
              <input
                id="passwordInput"
                type="text"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
                className="body-text-md py-1.5 px-4 mb-3 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50"
              />
              <button
                type="submit"
                className="my-4 col-span-1 btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-primary-200"
              >
                Submit
              </button>
            </form>
          </div>
        )}
        <div className="col-span-3 my-4">
          <p className="font-semibold heading-xs">Delete Account</p>
          <p className="">
            Permanently delete the account and remove access to all projects
          </p>
        </div>
        <button
          onClick={() => {
            setNameEdit(false);
            setEmailEdit(false);
            setPasswordEdit(false);
            setConfirmDeleteEdit(!confirmDeleteEdit);
          }}
          className="my-4 col-span-1 btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-caution-100 bg-caution-100 hover:bg-caution-200"
        >
          Delete Account
        </button>
        {confirmDeleteEdit && (
          <DeleteModal
            setConfirmDeleteEdit={setConfirmDeleteEdit}
            confirmDeleteEdit={confirmDeleteEdit}
            handleSubmitForModal={handleSubmitForModal}
            deleteModalText={deleteModalText}
          ></DeleteModal>
        )}
      </div>
    </>
  );
};
