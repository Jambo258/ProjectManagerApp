// React
import { useState } from "react";

// Redux Toolkit
import { useDeleteUserMutation, useUpdateUserMutation } from "../api/apiSlice";

// React Router
import { useNavigate } from "react-router-dom";

// Hook Form and Yup
import { FieldErrors, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Components
import { useAppSelector } from "../../app/hooks";
import { changeEmailSchema, changeNameSchema, changePasswordSchema } from "../auth/authValidation";
import { DeleteModal } from "../../components/DeleteModal";
import { Eye, EyeOff } from "react-feather";

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
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [deleteUser]  = useDeleteUserMutation();
  const navigate = useNavigate();
  const canSave = !isLoading;

  // Change Name
  const [nameEdit, setNameEdit] = useState(false);
  const [formErrorName, setNameFormError] = useState<null | string>(null);
  const {
    register: registerName,
    reset: resetName,
    handleSubmit: handleName,
    formState: { errors: errorsName },
  } = useForm<changeNameFormValues>({
    defaultValues: {
      name: user?.name,
    },
    resolver: yupResolver(changeNameSchema),
  });

  const onHandleSubmitName = async (formData: changeNameFormValues) => {
    if (user?.name === formData.name) {
      setNameEdit(false);
    } else if (canSave) {
      try {
        const user = await updateUser({
          name: formData.name,
        }).unwrap();
        if (user) {
          resetName({ name: user.name });
          setNameFormError(null);
          setNameEdit(false);
        }
      } catch (err) {
        onErrorName;
        console.error("Failed to save the user", err);
        if (
          err &&
          typeof err === "object" &&
          "data" in err &&
          err.data &&
          typeof err.data === "object" &&
          "name" in err.data && 
          typeof err.data.name === "string"
        ) {
          setNameFormError(err.data.name);
        }
      }
    }
  };

  // Change Email
  const [emailEdit, setEmailEdit] = useState(false);
  const [formErrorEmail, setEmailFormError] = useState<null | string>(null);
  const {
    register: registerEmail,
    reset: resetEmail,
    handleSubmit: handleEmail,
    formState: { errors: errorsEmail },
  } = useForm<changeEmailFormValues>({
    defaultValues: {
      email: user?.email,
    },
    resolver: yupResolver(changeEmailSchema),
  });

  const onHandleSubmitEmail = async (formData: changeEmailFormValues) => {
    if (user?.email === formData.email) {
      setEmailEdit(false);
    } else if (canSave) {
      try {
        const user = await updateUser({
          email: formData.email,
        }).unwrap();
        if (user) {
          resetEmail({ email: user.email });
          setEmailFormError(null);
          setEmailEdit(false);
        }
      } catch (err) {
        onErrorEmail;
        console.error("Failed to save the user", err);
        if (
          err &&
          typeof err === "object" &&
          "data" in err &&
          err.data &&
          typeof err.data === "object" &&
          "email" in err.data && 
          typeof err.data.email === "string"
        ) {
          setEmailFormError(err.data.email);
        }
      }
    }
  };

  // Change Password
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrorPassword, setPasswordFormError] = useState<null | string>(null);
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

  const onHandleSubmitPassword = async (formData: changePasswordFormValues) => {
    if (canSave) {
      try {
        const user = await updateUser({
          password: formData.password,
        }).unwrap();
        if (user) {
          resetPassword();
          setPasswordFormError(null);
          setPasswordEdit(false);
        }
      } catch (err) {
        onErrorPassword;
        console.error("Failed to save the user", err);
        if (
          err &&
          typeof err === "object" &&
          "data" in err &&
          err.data &&
          typeof err.data === "object" &&
          "password" in err.data &&
          typeof err.data.password === "string"
        ) {
          setPasswordFormError(err.data.password);
        }
      }
    }
  };

  // Delete User
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const deleteModalText = "Are you sure you want to delete this account?";

  const handleSubmitForModal = async () => {
    try {
      await deleteUser().unwrap();
      navigate("/");

    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const onErrorName = (errors: FieldErrors<changeNameFormValues>) => {
    console.error("Form field errors:", errors);
  };
  const onErrorEmail = (errors: FieldErrors<changeEmailFormValues>) => {
    console.error("Form field errors:", errors);
  };
  const onErrorPassword = (errors: FieldErrors<changePasswordFormValues>) => {
    console.error("Form field errors:", errors);
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
    <div className="max-w-full">

      {nameEdit ? (
        <form
          onSubmit={handleName(onHandleSubmitName, onErrorName)}
          className="col-span-4 grid grid-rows-1 grid-cols-4 sm:grid-rows-1 gap-x-4 grid-row-1 place-items-stretch">
          <section className="col-span-4 sm:col-span-3 mt-2">
            <label className="heading-xs">
            Name
              <input
                type="text"
                {...registerName("name")}
                autoFocus
                autoComplete="name"
                placeholder="Give your name..."
                className="block w-full py-1.5 px-2 body-text-md"
              />
              <p className="mt-1 body-text-xs text-caution-200">
                {errorsName.name?.message}
              </p>
              <p className="mt-1 body-text-xs text-caution-200">
                {formErrorName}
              </p>
            </label>
          </section>
          <section className="col-span-4 sm:col-span-1 flex items-center">
            <button
              type="submit"
              className="w-full px-2 py-2 btn-text-xs">
              Submit
            </button>
          </section>
        </form>
      ):(
        <section className="col-span-4 grid sm:grid-rows-1 sm:grid-cols-4 gap-x-3 grid-row-1">
          <section className="col-span-4 sm:col-span-3 mt-2">
            <p className="heading-xs">
            Name
            </p>
            <p className="block w-full py-1.5 px-2 body-text-md break-words">
              {user?.name}
            </p>
          </section>
          <section className="col-span-4 sm:col-span-1 flex items-center">
            <button
              type="button"
              onClick={() => {
                setNameEdit(!nameEdit);
                setEmailEdit(false);
                setPasswordEdit(false);
                resetFields();
              }}
              className="w-full px-2 py-2 btn-text-xs mb-4 sm:m-0">
              Change Name
            </button>
          </section>
        </section>
      )}

      {emailEdit ? (
        <form
          onSubmit={handleEmail(onHandleSubmitEmail, onErrorEmail)}
          className="col-span-4 grid grid-rows-1 grid-cols-4 sm:grid-rows-1 gap-x-4 grid-row-1 place-items-stretch">
          <section className="col-span-4 sm:col-span-3 mt-2">
            <label className="heading-xs">
            Email
              <input
                type="email"
                {...registerEmail("email")}
                autoFocus
                autoComplete="email"
                placeholder="Give your email..."
                className="block w-full py-1.5 px-2 body-text-md"
              />
              <p className="mt-1 body-text-xs text-caution-200">
                {errorsEmail.email?.message}
              </p>
              <p className="mt-1 body-text-xs text-caution-200">
                {formErrorEmail}
              </p>
            </label>
          </section>
          <section className="col-span-4 sm:col-span-1 flex items-center">
            <button
              type="submit"
              className="w-full px-2 py-2 btn-text-xs mb-4 sm:m-0">
              Submit
            </button>
          </section>
        </form>
      ):(
        <section
          className="col-span-4 grid grid-rows-1 grid-cols-4 sm:grid-rows-1 gap-x-4 grid-row-1 place-items-stretch">
          <section className="col-span-4 sm:col-span-3 mt-2">
            <p className="heading-xs">
            Email
            </p>
            <p className="block w-full py-1.5 px-2 body-text-md break-words">
              {user?.email}
            </p>
          </section>
          <section className="col-span-4 sm:col-span-1 flex items-center">
            <button
              type="button"
              onClick={() => {
                setNameEdit(false);
                setEmailEdit(!emailEdit);
                setPasswordEdit(false);
                resetFields();
              }}
              className="w-full px-2 py-2 btn-text-xs mb-4 sm:m-0">
              Change Email
            </button>
          </section>
        </section>
      )}

      {passwordEdit ? (
        <form
          onSubmit={handlePassword(onHandleSubmitPassword, onErrorPassword)}
          className="col-span-4 grid grid-rows-1 grid-cols-4 sm:grid-rows-1 gap-x-4 grid-row-1 place-items-stretch">
          <section className="col-span-4 sm:col-span-3">
            <label className="heading-xs">
              Password
              <section className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...registerPassword("password")}
                  autoFocus
                  autoComplete="new-password"
                  placeholder="Give your new password..."
                  className="block w-full py-1.5 px-2 body-text-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-grayscale-0 px-2 py-2.5 rounded-l-none absolute right-0 top-0 align-middle">
                  {showPassword ? <Eye size={18}/> : <EyeOff size={18}/>}
                </button>
              </section>
              <p className="mt-1 body-text-xs text-caution-200">
                {errorsPassword.password?.message}
              </p>
              <p className="mt-1 body-text-xs text-caution-200">
                {formErrorPassword}
              </p>
            </label>
          </section>
          <section className="col-span-4 sm:col-span-1 flex items-center">
            <button
              type="submit"
              className="w-full px-2 py-2 btn-text-xs mb-4 sm:m-0">
              Submit
            </button>
          </section>
        </form>
      ):(
        <section
          className="col-span-4 grid grid-rows-1 grid-cols-4 sm:grid-rows-1 gap-x-4 grid-row-1 place-items-stretch">
          <section className="col-span-4 sm:col-span-3">
            <p className="heading-xs">
            Password
            </p>
            <p className="w-full py-1.5 px-4 body-text-md">
              Set a new password to login to your account.
            </p>
          </section>
          <section className="col-span-4 sm:col-span-1 flex items-center">
            <button
              type="button"
              onClick={() => {
                setNameEdit(false);
                setEmailEdit(false);
                setPasswordEdit(!passwordEdit);
                resetFields();
              }}
              className="w-full px-2 py-2 btn-text-xs mb-4 sm:m-0">
              Change Password
            </button>
          </section>
        </section>
      )}

      <section
        className="col-span-4 grid grid-rows-1 grid-cols-4 sm:grid-rows-1 gap-x-4 grid-row-1 place-items-stretch ">
        <section className="col-span-4 sm:col-span-3">
          <p className="heading-xs">
            Delete Account
          </p>
          <p className="w-full py-1.5 px-4 body-text-md">
            Permanently delete your account and remove access to all projects.
          </p>
        </section>
        <section className="col-span-4 sm:col-span-1 flex items-center">
          <button
            type="button"
            onClick={() => {
              setNameEdit(false);
              setEmailEdit(false);
              setPasswordEdit(false);
              setConfirmDeleteEdit(!confirmDeleteEdit);
            }}
            className="w-full px-2 py-2 btn-text-xs bg-caution-100 hover:bg-caution-200">
              Delete Account
          </button>
        </section>
      </section>

      {confirmDeleteEdit &&
        <DeleteModal
          setConfirmDeleteEdit={setConfirmDeleteEdit}
          confirmDeleteEdit={confirmDeleteEdit}
          handleSubmitForModal={handleSubmitForModal}
          deleteModalText={deleteModalText}
        />}

    </div>
  );
};
