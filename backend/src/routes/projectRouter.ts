import { Router } from "express";

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
import { getUserById } from "../services/userService.js";
import { Role } from "@prisma/client";

const projectsRouter = Router();

projectsRouter.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Missing project name" });
    }
    const userId = req.session.userId!;
    const newProject = await createNewProject(name, userId);
    res.status(200).json(newProject);
  } catch (error) {
    next(error);
  }
});

projectsRouter.get("/", async (req, res, next) => {
  try {
    const userId = req.session.userId!;

    const usersProjects = await getAllProjectsAndPagesByUserId(userId);

    res.json(usersProjects);
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
      return res.status(404).json({ error: "Couldnt find project" });
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

    res.status(200).json(deletedProject);
  } catch (error) {
    next(error);
  }
});

projectsRouter.put("/:pid(\\d+)", async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.pid);
    const userId = req.session.userId!;
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Missing project name" });
    }

    const project = await getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Couldnt find project" });
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
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
});

projectsRouter.get("/:pid(\\d+)", async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.pid);
    const userId = req.session.userId!;
    const project = await getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Couldnt find project" });
    }
    const findExistingUser = await checkForUserExistingOnProject(
      userId,
      projectId
    );

    if (!findExistingUser) {
      return res.status(401).json({ error: "User is not on the project" });
    }

    const allProjectDetails = await getProjectAllDetailsById(projectId);
    res.json(allProjectDetails);
  } catch (error) {
    next(error);
  }
});

projectsRouter.post("/:pid(\\d+)/users/:uid(\\d+)", async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.pid);
    const userId = parseInt(req.params.uid);
    const sessionUserId = req.session.userId!;
    const { role } = req.body;
    if (!role || typeof role !== "string") {
      return res.status(400).json({ error: "Missing role" });
    }
    if (role !== Role.manager && role !== Role.editor && role !== Role.viewer) {
      return res.status(400).json({ error: "Wrong role" });
    }

    const findSessionUser = await checkForUserExistingOnProject(
      sessionUserId,
      projectId
    );

    if (!findSessionUser) {
      return res
        .status(401)
        .json({ error: "Session holder is not on this project" });
    }

    if (findSessionUser.role !== Role.manager) {
      return res.status(401).json({ error: "Manager role required" });
    }

    const findExistingUser = await checkForUserExistingOnProject(
      userId,
      projectId
    );

    if (findExistingUser) {
      return res.status(400).json({ error: "User is already on this project" });
    }

    const findUser = await getUserById(userId);
    if (!findUser) {
      return res.status(404).json({ error: "Couldnt find user" });
    }
    const findProject = await getProjectById(projectId);
    if (!findProject) {
      return res.status(404).json({ error: "Couldnt find project" });
    }

    const newUserToProject = await addUserToProject(userId, projectId, role);

    res.json(newUserToProject);
  } catch (error) {
    next(error);
  }
});

projectsRouter.put("/:pid(\\d+)/users/:uid(\\d+)", async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.pid);
    const userId = parseInt(req.params.uid);
    const sessionUserId = req.session.userId!;
    const { role } = req.body;
    if (!role || typeof role !== "string") {
      return res.status(400).json({ error: "Missing role" });
    }

    if (role !== Role.manager && role !== Role.editor && role !== Role.viewer) {
      return res.status(400).json({ error: "Wrong role" });
    }

    const findProject = await getProjectById(projectId);
    if (!findProject) {
      return res.status(404).json({ error: "Couldnt find project" });
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
      return res
        .status(401)
        .json({ error: "Session holder is not on this project" });
    }

    if (findSessionUser.role !== Role.manager) {
      return res.status(401).json({ error: "Manager role required" });
    }

    const findUser = await getUserById(userId);
    if (!findUser) {
      return res.status(404).json({ error: "Couldnt find user" });
    }

    const newUserRoleToProject = await changeUserRoleOnProject(
      userId,
      projectId,
      role
    );

    res.json(newUserRoleToProject);
  } catch (error) {
    next(error);
  }
});

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
        return res.status(404).json({ error: "Couldnt find project" });
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
        return res
          .status(401)
          .json({ error: "Session holder is not on this project" });
      }

      if (findSessionUser.role !== Role.manager) {
        return res.status(401).json({ error: "Manager role required" });
      }

      if (!findUser) {
        return res.status(404).json({ error: "Couldnt find user" });
      }

      const deletedUserFromProject = await removeUserFromProject(
        userId,
        projectId
      );

      res.json(deletedUserFromProject);
    } catch (error) {
      next(error);
    }
  }
);
export default projectsRouter;
