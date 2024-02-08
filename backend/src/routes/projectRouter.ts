import { Router } from "express";
import * as yup from "yup";
import validate from "../middlewares/validate.js";
import {
  removeUserFromProject,
  addUserToProject,
  changeUserRoleOnProject,
  createNewProject,
  deleteProject,
  getProjectAllDetailsById,
  getProjectById,
  updateProject,
  checkForUserExistingOnProject,
  getAllProjectsAndPagesByUserId,
} from "../services/projectService.js";
import { getUserByEmail, getUserById } from "../services/userService.js";
import { Role } from "@prisma/client";
import { type RequestBody } from "../types/types.js";

const projectsRouter = Router();

const projectNameSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Project name is required")
    .min(2, "Must be at least 2 characters long")
    .max(50, "Must be less than 50 characters long"),

});
type projectNameSchemaType = yup.InferType<typeof projectNameSchema>;

projectsRouter.post(
  "/",
  validate(projectNameSchema),
  async (req: RequestBody<projectNameSchemaType>, res, next) => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Missing project name" });
      }
      const userId = req.session.userId!;
      const newProject = await createNewProject(name, userId);
      return res.status(200).json(newProject);
    } catch (error) {
      next(error);
    }
  }
);

projectsRouter.get("/", async (req, res, next) => {
  try {
    const userId = req.session.userId!;

    const usersProjects = await getAllProjectsAndPagesByUserId(userId);

    return res.json(usersProjects);
  } catch (error) {
    next(error);
  }
});

projectsRouter.delete("/:pid(\\d+)", async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.pid);
    const project = await getProjectById(projectId);
    const userId = req.session.userId!;
    if (!project) {
      return res.status(404).json({ error: "Couldn't find project" });
    }
    const findExistingUser = await checkForUserExistingOnProject(
      userId,
      projectId
    );

    if (!findExistingUser) {
      return res.status(401).json({ error: "User is not on the project" });
    }
    if (findExistingUser.role !== Role.manager) {
      return res.status(401).json({ error: "Manager role required" });
    }
    const deletedProject = await deleteProject(projectId);

    return res.status(200).json(deletedProject);
  } catch (error) {
    next(error);
  }
});

projectsRouter.put(
  "/:pid(\\d+)",
  validate(projectNameSchema),
  async (req: RequestBody<projectNameSchemaType>, res, next) => {
    try {
      const projectId = parseInt(req.params.pid);
      const userId = req.session.userId!;
      const { name } = req.body;

      if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Missing project name" });
      }

      const project = await getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Couldn't find project" });
      }

      const findExistingUser = await checkForUserExistingOnProject(
        userId,
        projectId
      );

      if (!findExistingUser) {
        return res.status(401).json({ error: "User is not on the project" });
      }
      if (findExistingUser.role !== Role.manager) {
        return res.status(401).json({ error: "Manager role required" });
      }

      const updatedProject = await updateProject(projectId, name);
      return res.json(updatedProject);
    } catch (error) {
      next(error);
    }
  }
);

projectsRouter.get("/:pid(\\d+)", async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.pid);
    const userId = req.session.userId!;
    const project = await getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Couldn't find project" });
    }
    const findExistingUser = await checkForUserExistingOnProject(
      userId,
      projectId
    );

    if (!findExistingUser) {
      return res.status(401).json({ error: "User is not on the project" });
    }

    const allProjectDetails = await getProjectAllDetailsById(projectId);
    return res.json(allProjectDetails);
  } catch (error) {
    next(error);
  }
});

const addUserToProjectSchema = yup.object({
  role: yup.string().trim().required("Role is required"),
  email: yup.string().trim().required("Email is required").email("Must be a valid email"),
});

type addUserToProjectSchemaType = yup.InferType<typeof addUserToProjectSchema>;

projectsRouter.post(
  "/:pid(\\d+)/users/",
  validate(addUserToProjectSchema),
  async (req: RequestBody<addUserToProjectSchemaType>, res, next) => {
    try {
      const projectId = parseInt(req.params.pid);
      const sessionUserId = req.session.userId!;
      const { role, email } = req.body;
      if (
        !role ||
        typeof role !== "string" ||
        !email ||
        typeof email !== "string"
      ) {
        return res.status(400).json({ error: "Missing role or email" });
      }
      if (
        role !== Role.manager &&
        role !== Role.editor &&
        role !== Role.viewer
      ) {
        return res.status(400).json({ error: "Wrong role" });
      }

      const findUser = await getUserByEmail(email);
      if (!findUser) {
        return res
          .status(404)
          .json({ error: "Couldn't find user with such email" });
      }
      const userId = findUser.id;

      const findSessionUser = await checkForUserExistingOnProject(
        sessionUserId,
        projectId
      );

      if (!findSessionUser) {
        return res.status(401).json({ error: "You are not on this project" });
      }

      if (findSessionUser.role !== Role.manager) {
        return res.status(401).json({ error: "Manager role required" });
      }

      const findExistingUser = await checkForUserExistingOnProject(
        userId,
        projectId
      );

      if (findExistingUser) {
        return res
          .status(400)
          .json({ error: "User is already on this project" });
      }

      const findProject = await getProjectById(projectId);
      if (!findProject) {
        return res.status(404).json({ error: "Couldn't find project" });
      }

      const newUserToProject = await addUserToProject(userId, projectId, role);

      return res.json(newUserToProject);
    } catch (error) {
      next(error);
    }
  }
);

const addRoleToUserSchema = yup.object({
  role: yup.string().trim().required("Role is required"),
});

type addRoleToUserSchemaType = yup.InferType<typeof addRoleToUserSchema>;

projectsRouter.put(
  "/:pid(\\d+)/users/:uid(\\d+)",
  validate(addRoleToUserSchema),
  async (req: RequestBody<addRoleToUserSchemaType>, res, next) => {
    try {
      const projectId = parseInt(req.params.pid);
      const userId = parseInt(req.params.uid);
      const sessionUserId = req.session.userId!;
      const { role } = req.body;
      if (!role || typeof role !== "string") {
        return res.status(400).json({ error: "Missing role" });
      }

      if (
        role !== Role.manager &&
        role !== Role.editor &&
        role !== Role.viewer
      ) {
        return res.status(400).json({ error: "Wrong role" });
      }

      const findProject = await getProjectById(projectId);
      if (!findProject) {
        return res.status(404).json({ error: "Couldn't find project" });
      }
      const findExistingUser = await checkForUserExistingOnProject(
        userId,
        projectId
      );
      if (!findExistingUser) {
        return res.status(401).json({ error: "User is not on the project" });
      }

      const findSessionUser = await checkForUserExistingOnProject(
        sessionUserId,
        projectId
      );

      if (!findSessionUser) {
        return res.status(401).json({ error: "You are not on the project" });
      }

      if (findSessionUser.role !== Role.manager) {
        return res.status(401).json({ error: "Manager role required" });
      }

      const findUser = await getUserById(userId);
      if (!findUser) {
        return res.status(404).json({ error: "Couldn't find user" });
      }

      const newUserRoleToProject = await changeUserRoleOnProject(
        userId,
        projectId,
        role
      );

      return res.json(newUserRoleToProject);
    } catch (error) {
      next(error);
    }
  }
);

projectsRouter.delete(
  "/:pid(\\d+)/users/:uid(\\d+)",
  async (req, res, next) => {
    try {
      const projectId = parseInt(req.params.pid);
      const userId = parseInt(req.params.uid);
      const sessionUserId = req.session.userId!;
      const findUser = await getUserById(userId);

      const findProject = await getProjectById(projectId);
      if (!findProject) {
        return res.status(404).json({ error: "Couldn't find project" });
      }

      const findExistingUser = await checkForUserExistingOnProject(
        userId,
        projectId
      );
      if (!findExistingUser) {
        return res.status(400).json({ error: "User is not on the project" });
      }

      const findSessionUser = await checkForUserExistingOnProject(
        sessionUserId,
        projectId
      );

      if (!findSessionUser) {
        return res.status(401).json({ error: "You are not on the project" });
      }

      if (findSessionUser.role !== Role.manager && sessionUserId !== userId) {
        return res.status(401).json({ error: "Manager role required" });
      }

      if (!findUser) {
        return res.status(404).json({ error: "Couldn't find user" });
      }

      const deletedUserFromProject = await removeUserFromProject(
        userId,
        projectId
      );

      return res.json(deletedUserFromProject);
    } catch (error) {
      next(error);
    }
  }
);
export default projectsRouter;
