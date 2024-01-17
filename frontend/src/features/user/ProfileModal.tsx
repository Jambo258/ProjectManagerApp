import { useState } from "react";
import { DeleteModal } from "../../components/DeleteModal";
import { useDeleteUserMutation, useUpdateUserMutation } from "../api/apiSlice";
import { changeEmailSchema, changeNameSchema, changePasswordSchema } from "../auth/authValidation";
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

export const ProfileModal = () => {
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
  const deleteModalText = "Are you sure you want to delete this account?";

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
      <div className="max-w-2xl m-auto grid grid-cols-4 gap-x-3 grid-flow-row items-center body-text-sm">
        <section className="col-span-3 my-4">
          <p className="heading-xs">Name</p>
          <p>{user?.name}</p>
        </section>
        <button
          type="button"
          onClick={() => {
            setNameEdit(!nameEdit);
            setEmailEdit(false);
            setPasswordEdit(false);
            resetFields();
          }}
          className="col-span-1 mt-4 py-2 btn-text-xs"
        >
          Change Name
        </button>
        {nameEdit && (
          <section className="col-span-3">
            <form onSubmit={handleName(onHandleSubmitName, onErrorName)}>
              <label>
                Name
                <input
                  type="text"
                  {...registerName("name")}
                  className="block w-full py-2 px-4 mb-3 body-text-md focus:outline-none focus:ring focus:ring-dark-blue-50"
                />
                <p className="mt-1 text-center body-text-xs text-caution-200">
                  {errorsName.name?.message}
                </p>
                <p className="mt-1 text-center body-text-xs text-caution-200">
                  {formErrorName}
                </p>
              </label>
              <button
                type="submit"
                className="col-span-1 mb-4 py-2 btn-text-xs"
              >
                Submit
              </button>
            </form>
          </section>
        )}

        <section className="col-span-3 my-4">
          <p className="heading-xs">Email</p>
          <p>{user?.email}</p>
        </section>
        <button
          type="button"
          onClick={() => {
            setNameEdit(false);
            setEmailEdit(!emailEdit);
            setPasswordEdit(false);
            resetFields();
          }}
          className="my-4 py-2 col-span-1 btn-text-xs"
        >
          Change Email
        </button>
        {emailEdit && (
          <section className="col-span-3">
            <form onSubmit={handleEmail(onHandleSubmitEmail, onErrorEmail)}>
              <label>
                Email
                <input
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
              </label>
              <button
                type="submit"
                className="col-span-1 my-4 py-2 btn-text-xs"
              >
                Submit
              </button>
            </form>
          </section>
        )}
        <section className="col-span-3 my-4">
          <p className="heading-xs">Password</p>
          <p>Set a permanent password to login to your account.</p>
        </section>
        <button
          type="button"
          onClick={() => {
            setNameEdit(false);
            setEmailEdit(false);
            setPasswordEdit(!passwordEdit);
            resetFields();
          }}
          className="col-span-1 my-4 py-2 px-2 btn-text-xs"
        >
          Change Password
        </button>
        {passwordEdit && (
          <section className="col-span-3">
            <form onSubmit={handlePassword(onHandleSubmitPassword, onErrorPassword)}>
              <label>
                Password
                <input
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
              </label>
              <button
                type="submit"
                className="col-span-1 my-4 py-2 btn-text-xs"
              >
                Submit
              </button>
            </form>
          </section>
        )}
        <section className="col-span-3 my-4">
          <p className="heading-xs">Delete Account</p>
          <p>
            Permanently delete the account and remove access to all projects.
          </p>
        </section>
        <button
          type="button"
          onClick={() => {
            setNameEdit(false);
            setEmailEdit(false);
            setPasswordEdit(false);
            setConfirmDeleteEdit(!confirmDeleteEdit);
          }}
          className="col-span-1 my-4 py-2 px-2 btn-text-xs bg-caution-100 hover:bg-caution-200"
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
