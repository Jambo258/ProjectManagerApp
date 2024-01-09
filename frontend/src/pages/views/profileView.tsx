import { useState } from "react";
import { DeleteModal } from "../components/deleteModal";
import { useDeleteUserMutation, useUpdateUserMutation } from "../../features/api/apiSlice";
import { changeEmailSchema, changeNameSchema, changePasswordSchema } from "../../features/auth/authValidation";
import { FieldErrors, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";

interface changeNameFormValues {
  name: string;
}

interface changeEmailFormValues {
  email: string;
}

interface changePasswordFormValues {
  password: string;
}

export const ProfileView = () => {
  const user = useAppSelector((state) => state.auth.user);
  console.log(user);

  const [nameEdit, setNameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const [formErrorName, setNameFormError] = useState<null | string>(null);
  const [formErrorEmail, setEmailFormError] = useState<null | string>(null);
  const [formErrorPassword, setPasswordFormError] = useState<null | string>(null);
  const navigate = useNavigate();
  const deleteModalText = "Are you sure you want to delete account?";

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [deleteUser]  = useDeleteUserMutation();

  const canSave = !isLoading;

  const {
    register: registerName,
    reset: resetName,
    handleSubmit: handleName,
    formState: {errors: errorsName },
  } = useForm<changeNameFormValues>({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(changeNameSchema),
  });

  const {
    register: registerEmail,
    reset: resetEmail,
    handleSubmit: handleEmail,
    formState: { errors: errorsEmail },
  } = useForm<changeEmailFormValues>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(changeEmailSchema),
  });

  const {
    register: registerPassword,
    reset: resetPassword,
    formState: { errors: errorsPassword },
    handleSubmit: handlePassword,
  } = useForm<changePasswordFormValues>({
    defaultValues: {
      password: "",
    },
    resolver: yupResolver(changePasswordSchema),
  });

  const onHandleSubmitName = async (formData: changeNameFormValues) => {
    if (canSave) {
      try {
        const user = await updateUser({
          name: formData.name,
        }).unwrap();
        console.log("User:", user);
        resetName();
        setNameFormError(null);
      } catch (err) {
        onErrorName;
        console.error("Failed to save the user", err);
        if (
          err &&
          typeof err === "object" &&
          "data" in err &&
          err.data &&
          typeof err.data === "object"
        ) {
          const errorMessage = Object.values(err.data);
          setNameFormError(errorMessage.toString());
        }
      }
    }
  };

  const onHandleSubmitEmail = async (formData: changeEmailFormValues) => {
    if (canSave) {
      try {
        const user = await updateUser({
          email: formData.email,
        }).unwrap();
        console.log("User:", user);
        resetEmail();
        setEmailFormError(null);
      } catch (err) {
        onErrorEmail;
        console.error("Failed to save the user", err);
        if (
          err &&
          typeof err === "object" &&
          "data" in err &&
          err.data &&
          typeof err.data === "object"
        ) {
          const errorMessage = Object.values(err.data);
          setEmailFormError(errorMessage.toString());
        }
      }
    }
  };

  const onHandleSubmitPassword = async (formData: changePasswordFormValues) => {
    if (canSave) {
      try {
        const user = await updateUser({
          password: formData.password,
        }).unwrap();
        console.log("User:", user);
        resetPassword();
        setPasswordFormError(null);
      } catch (err) {
        onErrorPassword;
        console.error("Failed to save the user", err);
        if (
          err &&
          typeof err === "object" &&
          "data" in err &&
          err.data &&
          typeof err.data === "object"
        ) {
          const errorMessage = Object.values(err.data);
          setPasswordFormError(errorMessage.toString());
        }
      }
    }
  };

  const onErrorName = (errors: FieldErrors<changeNameFormValues>) => {
    console.log("Form field errors:", errors);
  };
  const onErrorEmail = (errors: FieldErrors<changeEmailFormValues>) => {
    console.log("Form field errors:", errors);
  };
  const onErrorPassword = (errors: FieldErrors<changePasswordFormValues>) => {
    console.log("Form field errors:", errors);
  };

  const handleSubmitForModal = async () => {
    try {
      const user = await deleteUser().unwrap();
      console.log("User deleted:", user);
      navigate("/");

    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const resetFields = () => {
    resetName();
    resetEmail();
    resetPassword();
    setNameFormError(null);
    setEmailFormError(null);
    setPasswordFormError(null);
  };

  return (
    <>
      <div className="grid grid-flow-row max-w-2xl m-auto gap-x-3 body-text-md">
        <div className="heading-xl col-span-4 mt-4">Account settings</div>
        <div className="col-span-3 my-4">
          <p className="font-semibold heading-xs">Name</p>
          <p className="">{user?.name}</p>
        </div>
        <button
          onClick={() => {
            setNameEdit(!nameEdit);
            setEmailEdit(false);
            setPasswordEdit(false);
            resetFields();
          }}
          className="my-4 col-span-1 btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-primary-200"
        >
          Change Name
        </button>
        {nameEdit && (
          <div className="col-span-3">
            <form
              onSubmit={handleName(onHandleSubmitName, onErrorName)}
              className=""
            >
              <label htmlFor="nameInput" className="">
                Name
              </label>
              <input
                id="nameInput"
                type="text"
                {...registerName("name")}
                className="body-text-md py-1.5 px-4 mb-3 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50"
              />
              <p className="text-center body-text-xs text-caution-200 mt-1">
                {errorsName.name?.message}
              </p>
              <p className="text-center body-text-xs text-caution-200 mt-1">
                {formErrorName}
              </p>
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
          <p className="">{user?.email}</p>
        </div>
        <button
          onClick={() => {
            setNameEdit(false);
            setEmailEdit(!emailEdit);
            setPasswordEdit(false);
            resetFields();
          }}
          className="my-4 col-span-1 btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-primary-200"
        >
          Change Email
        </button>
        {emailEdit && (
          <div className="col-span-3">
            <form
              onSubmit={handleEmail(onHandleSubmitEmail, onErrorEmail)}
              className=""
            >
              <label htmlFor="emailInput" className="">
                Email
              </label>
              <input
                id="emailInput"
                type="email"
                {...registerEmail("email")}
                className="body-text-md py-1.5 px-4 mb-3 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50"
              />
              <p className="text-center body-text-xs text-caution-200 mt-1">
                {errorsEmail.email?.message}
              </p>
              <p className="text-center body-text-xs text-caution-200 mt-1">
                {formErrorEmail}
              </p>
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
          <p className="">Set a permanent password to login to your account.</p>
        </div>
        <button
          onClick={() => {
            setNameEdit(false);
            setEmailEdit(false);
            setPasswordEdit(!passwordEdit);
            resetFields();
          }}
          className="my-4 col-span-1 btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-primary-200"
        >
          Change Password
        </button>
        {passwordEdit && (
          <div className="col-span-3">
            <form
              onSubmit={handlePassword(onHandleSubmitPassword, onErrorPassword)}
              className=""
            >
              <label htmlFor="passwordInput" className="">
                Password
              </label>
              <input
                id="passwordInput"
                type="text"
                {...registerPassword("password")}
                className="body-text-md py-1.5 px-4 mb-3 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50"
              />
              <p className="text-center body-text-xs text-caution-200 mt-1">
                {errorsPassword.password?.message}
              </p>
              <p className="text-center body-text-xs text-caution-200 mt-1">
                {formErrorPassword}
              </p>
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
            Permanently delete the account and remove access to all projects.
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
