import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { useAddNewProjectUserMutation } from "../api/apiSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { inviteUserSchema } from "../auth/authValidation";
import { ProjectMember } from "./ProjectMember";

// For testing purposes
interface Member {
  id?: number,
  name: string,
  email: string,
  role: string
}

// For testing purposes
const members: Member[] = [
  {
    id: 1,
    name: "Anni Aatos",
    email: "anni.aatos@mail.com",
    role: "editor"
  },
  {
    id: 2,
    name: "Berit Käppänä",
    email: "berit@mail.com",
    role: "manager"
  },
  {
    id: 3,
    name: "Carita Sammal",
    email: "caritasammal@mail.com",
    role: "viewer"
  }
];    

// For testing purposes
// Current user's role
// Different things shown to manager and member
const userRole = "manager";

interface InviteProjectMemberValues {
  email: string;
  role: string;
}

export const ProjectMembersModal = () => {
  const [selectValue, setSelectValue] = useState<string>("");

  const [addNewProjectUser, { isLoading }] = useAddNewProjectUserMutation();
  const [formError, setFormError] = useState<null | string>(null);

  const {
    formState: {isDirty, isSubmitting, errors},
    handleSubmit,
    register,
    reset
  } = useForm<InviteProjectMemberValues>({
    defaultValues: {
      email: "",
      role: "viewer"
    },
    resolver: yupResolver(inviteUserSchema),
  });

  const canSubmit = isDirty && !isLoading;

  const onHandleSubmit = async (formData: InviteProjectMemberValues) => {
    console.log(formData.role);

    if (canSubmit) {
      try {
        // await addNewProjectUser({ role: ?? } ).unwrap();
        console.log("User invited (NOT WORKING YET): ", formData);
        reset();
        setFormError(null);
      } catch (err) {
        onError;
        console.error("Failed to save the user", err);
        if (
          err &&
          typeof err === "object" &&
          "data" in err &&
          err.data &&
          typeof err.data === "object"
        ) {
          const errorMessage = Object.values(err.data);
          setFormError(errorMessage.toString());
        }
      }
    }
  };

  const onError = (errors: FieldErrors<InviteProjectMemberValues>) => {
    console.log("Form field errors:", errors);
  };

  return (
    <>
      { (userRole === "manager") &&
      <>
        <form  className="flex flex-row gap-2 mb-2"
          onSubmit={handleSubmit(onHandleSubmit, onError)} noValidate>
          <input 
            type="email"
            {...register("email")}
            placeholder="E.g. example@mail.com"
            className="flex-1 w-1/2 p-2 body-text-sm border border-grayscale-300" />
      
          <select value={selectValue} 
            {...register("role")}
            onChange={(e) => setSelectValue(e.target.value)}
            className="p-2 btn-text-xs border border-grayscale-300">
            <option value="editor" 
              className="btn-text-xs">Editor</option>
            <option value="viewer" 
              className="btn-text-xs">Viewer</option>
            <option value="manager" 
              className="btn-text-xs">Manager</option>
          </select> 

          <button type="submit" className="p-2 btn-text-xs" disabled={isSubmitting} >
          Invite
          </button>
        </form>
      
        <p className="body-text-xs text-caution-200 mt-1">{errors.email?.message}</p>
        <p className="body-text-xs text-caution-200 mt-1">{formError}</p>
      </>
      }
      
      <h2 className="heading-xs mt-4">Current project members</h2>
      {
        // Get members from project
        members.map((member: Member) => (
          <ProjectMember 
            key={member.id} id={member.id} name={member.name} email={member.email} role={member.role} />
        )
        )
      }

      <div className="flex flex-row gap-4 items-center pt-4">
        <div className="flex-1 items-center">
          <h3 className="heading-xs">
          Leave project
          </h3>
          <p className="body-text-sm">If you leave project, you can&#39;t return without being invited again by a manager.</p>
        </div>
        <button 
          className="bg-caution-100 hover:bg-caution-200 btn-text-xs p-2" 
          onClick={() => console.log("Leave project")}>Leave project</button>
      </div>
    </>
  );
};
