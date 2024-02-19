import { useEffect, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import useScreenDimensions from "../../utils/screenDimensions";

import { useAddNewProjectUserMutation, useDeleteProjectUserMutation, useGetProjectQuery } from "../api/apiSlice";
import { inviteUserSchema } from "../auth/authValidation";
import { useAppSelector } from "../../app/hooks";

import { LeaveProjectModal } from "./LeaveProjectModal";
import { ProjectMemberItem } from "./ProjectMemberItem";

import { type Member } from "../api/apiSlice";

interface ProjectMembersModalProps {
  projectId: number;
}

interface InviteProjectMemberValues {
  email: string;
  role: string;
}

export const ProjectMembersModal = ({ projectId }: ProjectMembersModalProps) => {
  const navigate = useNavigate();
  const screenDimensions = useScreenDimensions();

  const [selectValue, setSelectValue] = useState<string>("viewer");
  const [userRole, setUserRole] = useState<string>("viewer");

  const user = useAppSelector((state) => state.auth.user);
  const { data: project } = useGetProjectQuery(projectId);

  useEffect(() => {
    project?.users.map((member: Member) => {
      if (member.id === user?.id) {
        setUserRole(member.role);
      }
    });
  });

  // Add new member
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

  const [formError, setFormError] = useState<null | string>(null);

  const onError = (errors: FieldErrors<InviteProjectMemberValues>) => {
    console.error("Form field errors:", errors);
  };

  const [addProjectMember, { isLoading }] = useAddNewProjectUserMutation();
  const canSubmit = isDirty && !isLoading;

  const onHandleSubmit = async (formData: InviteProjectMemberValues) => {
    if (canSubmit) {
      try {
        await addProjectMember({email: formData.email, projectId: projectId, role: formData.role}).unwrap();
        setSelectValue("viewer");
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

  // Leave project
  const [deleteUser] = useDeleteProjectUserMutation();

  if (!user) {
    return null;
  }

  const leaveProject = async () => {
    try {
      await deleteUser({projectId: projectId, userId: user.id, role: userRole}).unwrap();
      navigate("..", { relative: "path" });
      navigate(0);
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  return (
    <>
      { (userRole === "manager") &&
      <section>
        <form className="grid grid-flow-rows sm:grid-flow-col sm:grid-col-3 gap-2 mb-2"
          onSubmit={handleSubmit(onHandleSubmit, onError)} noValidate>
          <input
            type="email"
            {...register("email")}
            aria-label="Email"
            autoFocus
            placeholder="E.g. example@mail.com"
            className="col-span-3 sm:col-span-1 p-2 body-text-sm border border-grayscale-300" />

          <select value={selectValue}
            {...register("role")}
            onChange={(e) => setSelectValue(e.target.value)}
            aria-label="Select user role"
            className="col-span-3 sm:col-span-1 p-2 btn-text-xs border border-grayscale-300">
            <option value="viewer"
              className="btn-text-xs">Viewer</option>
            <option value="editor"
              className="btn-text-xs">Editor</option>
            <option value="manager"
              className="btn-text-xs">Manager</option>
          </select>

          <button type="submit" className="col-span-3 sm:col-span-1 p-2 btn-text-xs" disabled={isSubmitting} >
          Invite
          </button>
        </form>

        <p className="body-text-xs text-caution-200 mt-1">{errors.email?.message}</p>
        <p className="body-text-xs text-caution-200 mt-1">{formError}</p>
      </section>
      }

      <h4 className="heading-xs mt-4">Current project members</h4>
      <div className={screenDimensions.height < 500 ? "overflow-visible" : "max-h-[310px] overflow-y-auto"}>
        { project?.users.map((member: Member) => (
          <ProjectMemberItem key={member.id} member={member} projectId={projectId} userId={user.id} userRole={userRole} />
        ))}
      </div>

      <section className="flex flex-row gap-4 items-center pt-4">
        <div className="flex-1 items-center">
          <h5 className="heading-xs">
          Leave project
          </h5>
          <p className="body-text-sm">If you leave project, you can&#39;t return without being invited again by a manager.</p>
        </div>
        <LeaveProjectModal handleRemove={leaveProject} />
      </section>
    </>
  );
};
