import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { useAddNewProjectUserMutation, useGetProjectQuery } from "../api/apiSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { inviteUserSchema } from "../auth/authValidation";
import { ProjectMember } from "./ProjectMember";

interface Member {
  id: number,
  role: string,
  handleUserRemoval: () => void
}

// For testing
// Current user's role and projectId
const userRole = "manager";

interface InviteProjectMemberValues {
  email: string;
  role: string;
}

// TO DO
// Add new user (only managers)
// - Check if user with that email exists
// - Check if that user is already a project member

// Change role (only managers)
// - If you're only manager, you can't change your own role?

// Remove user from project (only managers)
// - Use DeleteModal for confimation?

// Leave project
// - Can't leave if you're only manager and there's still other members
// - Is project deleted if you're last one to leave? 
// - Use DeleteModal 

export const ProjectMembersModal = () => {
  const [selectValue, setSelectValue] = useState<string>("");
  
  const {
    formState: {isDirty, isSubmitting, errors},
    handleSubmit,
    register,
    reset
  } = useForm<InviteProjectMemberValues>({
    defaultValues: {
      email: "",
      role: "editor"
    },
    resolver: yupResolver(inviteUserSchema),
  });

  const [formError, setFormError] = useState<null | string>(null);
  const [addProjectMember, { isLoading }] = useAddNewProjectUserMutation();
  const canSubmit = isDirty && !isLoading;

  const onHandleSubmit = (formData: InviteProjectMemberValues) => {
    // Delete this when this is updated
    console.log(formData);

    if (canSubmit) {
      try {
        // Add new project member here
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

  const handleUserRemoval = () => {
    // Remove user here
    // Need project and user id?
  };

  // Project number as dummy data
  const { data: project } = useGetProjectQuery(3);

  return (
    <>
      { (userRole === "manager") &&
      <section>
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
      </section>
      }
      
      <h2 className="heading-xs mt-4">Current project members</h2>
      { project?.users.map((member: Member) => (
        <>
          <ProjectMember 
            key={member.id} id={member.id} role={member.role} handleUserRemoval={handleUserRemoval} />
        </>
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
          onClick={() => handleUserRemoval()}
          disabled={userRole !== "manager"}>
            Leave project
        </button>
      </div>
    </>
  );
};
