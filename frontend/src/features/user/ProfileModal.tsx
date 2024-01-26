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
  console.log(user);

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
        // For development only
        console.log("User:", user);
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
          typeof err.data === "object"
        ) {
          const errorMessage = Object.values(err.data);
          setNameFormError(errorMessage.toString());
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
        // For development only
        console.log("User:", user);
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
          typeof err.data === "object"
        ) {
          const errorMessage = Object.values(err.data);
          setEmailFormError(errorMessage.toString());
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
        // For development only
        console.log("User:", user);
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
          typeof err.data === "object"
        ) {
          const errorMessage = Object.values(err.data);
          setPasswordFormError(errorMessage.toString());
        }
      }
    }
  };

  // Delete User
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const deleteModalText = "Are you sure you want to delete this account?";

  const handleSubmitForModal = async () => {
    try {
      const user = await deleteUser().unwrap();
      // For development only
      console.log("User deleted:", user);
      navigate("/");

    } catch (err) {
      console.error("Failed to delete user", err);
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

  const resetFields = () => {
    resetName();
    resetEmail();
    resetPassword();
    setNameFormError(null);
    setEmailFormError(null);
    setPasswordFormError(null);
  };

  return (
    <div className="sm:max-w-[600px] max-w-full"> 


      {nameEdit ? (
        <form
          onSubmit={handleName(onHandleSubmitName, onErrorName)}
          className="col-span-4 grid grid-cols-4 gap-x-3 grid-row-1">
          <section className="col-span-3">                
            <label className="heading-xs">
            Name
              <input
                type="text"
                {...registerName("name")}
                className="block w-full py-1.5 px-4 mb-3 body-text-md"
              />
              <p className="mt-1 body-text-xs text-caution-200">
                {errorsName.name?.message}
              </p>
              <p className="mt-1 body-text-xs text-caution-200">
                {formErrorName}
              </p>
            </label>
          </section>
          <section className="col-span-1">
            <button
              type="submit"
              className="w-full px-2 py-2 btn-text-xs">
              Submit
            </button>
          </section>
        </form>
      ):(
        <section className="col-span-4 grid grid-cols-4 gap-x-3 grid-row-1">     
          <section className="col-span-3"> 
            <p className="heading-xs">
            Name
            </p>
            <p className="block w-full py-1.5 px-4 mb-3 body-text-md">{user?.name}</p>
          </section>
          <section className="col-span-1">
            <button
              type="button"
              onClick={() => {
                setNameEdit(!nameEdit);
                setEmailEdit(false);
                setPasswordEdit(false);
                resetFields();
              }}
              className="w-full px-2 py-2 btn-text-xs">
              Change Name
            </button>
          </section>
        </section>
      )}
      
      {emailEdit ? (
        <form
          onSubmit={handleEmail(onHandleSubmitEmail, onErrorEmail)}
          className="col-span-4 grid grid-cols-4 gap-x-3 grid-row-1">
          <section className="col-span-3">
            <label className="heading-xs">
            Email
              <input
                type="email"
                {...registerEmail("email")}
                className="block w-full py-1.5 px-4 mb-3 body-text-md"
              />
              <p className="mt-1 body-text-xs text-caution-200">
                {errorsEmail.email?.message}
              </p>
              <p className="mt-1 body-text-xs text-caution-200">
                {formErrorEmail}
              </p>
            </label>
          </section>
          <section className="col-span-1">
            <button
              type="submit"
              className="w-full px-2 py-2 btn-text-xs">
              Submit
            </button>
          </section>
        </form>
      ):(
        <section className="col-span-4 grid grid-cols-4 gap-x-3 grid-row-1">
          <section className="col-span-3">
            <p className="heading-xs">
            Email
            </p>
            <p className="block w-full py-1.5 px-4 mb-3 body-text-md">{user?.email}</p>
          </section>
          <section className="col-span-1">
            <button
              type="button"
              onClick={() => {
                setNameEdit(false);
                setEmailEdit(!emailEdit);
                setPasswordEdit(false);
                resetFields();
              }}
              className="w-full px-2 py-2 mb-2 sm:m-0 btn-text-xs">
              Change Email
            </button>
          </section>
        </section>
      )}

      {passwordEdit ? (
        <form
          onSubmit={handlePassword(onHandleSubmitPassword, onErrorPassword)}
          className="col-span-4 grid grid-cols-4 gap-x-3 grid-row-1">
          <section className="col-span-3">
            <label className="heading-xs">
              Password
              <section className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...registerPassword("password")}
                  autoComplete="new-password"
                  className="block w-full py-1.5 px-4 mb-3 body-text-md"
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
          <section className="col-span-1">
            <button
              type="submit"
              className="w-full px-2 py-2 btn-text-xs">
              Submit
            </button>
          </section>
        </form>
      ):(
        <section className="col-span-4 grid grid-cols-4 gap-x-3 grid-row-1">
          <section className="col-span-3">
            <p className="heading-xs">
            Password
            </p>
            <p className="w-full py-1.5 px-4 mb-3 body-text-md">Set a new password to login to your account.</p>
          </section>
          <section className="col-span-1">
            <button
              type="button"
              onClick={() => {
                setNameEdit(false);
                setEmailEdit(false);
                setPasswordEdit(!passwordEdit);
                resetFields();
              }}
              className="w-full px-2 py-2 mb-2 sm:m-0 btn-text-xs">
              Change Password
            </button>
          </section>
        </section>
      )}


      <section className="col-span-4 grid grid-cols-4 gap-x-3 grid-row-1">
        <section className="col-span-3">
          <p className="heading-xs">Delete Account</p>
          <p className="w-full py-1.5 px-4 mb-3 body-text-md">
              Permanently delete your account and remove access to all projects.
          </p>
        </section>
        <section className="col-span-1">
          <button
            type="button"
            onClick={() => {
              setNameEdit(false);
              setEmailEdit(false);
              setPasswordEdit(false);
              setConfirmDeleteEdit(!confirmDeleteEdit);
            }}
            className="w-full px-2 py-2 mb-2 sm:m-0 btn-text-xs bg-caution-100 hover:bg-caution-200">
              Delete Account
          </button>
        </section>
      </section>
      {confirmDeleteEdit &&
        <DeleteModal
          setConfirmDeleteEdit={setConfirmDeleteEdit}
          confirmDeleteEdit={confirmDeleteEdit}
          handleSubmitForModal={handleSubmitForModal}
          deleteModalText={deleteModalText} />}
    </div>
    
  );
};
