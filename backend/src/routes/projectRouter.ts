import { Router } from "express";

import {
  removeUserFromProject,
  addUserToProject,
  changeUserRoleOnProject,
  createNewProject,
  deleteProject,
  getAllProjectsByUserId,
  getProjectAllDetailsById,
  getProjectById,
  updateProject,
  checkForUserExistingOnProject,
} from "../services/projectService.js";
import { getUserById } from "../services/userService.js";
import { Role } from "@prisma/client";
import authenticate from "../middlewares/authenticate.js";

const projectsRouter = Router();

projectsRouter.post("/", authenticate, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send({ error: "Missing project name" });
  }
  const userId = req.session.userId!;
  const newProject = await createNewProject(name, userId);
  res.status(200).send(newProject);
});

projectsRouter.get("/", authenticate, async (req, res) => {
  const userId = req.session.userId!;

  const usersProjects = await getAllProjectsByUserId(userId);
  if (!usersProjects) {
    return res.status(404).send({ error: "Couldnt find user projects" });
  }

  res.json(usersProjects);
});

projectsRouter.delete("/:pid(\\d+)", authenticate, async (req, res) => {
  const projectId = parseInt(req.params.pid);
  const project = await getProjectById(projectId);
  const userId = req.session.userId!;
  if (!project) {
    return res.status(404).send({ error: "Couldnt find project" });
  }
  const findExistingUser = await checkForUserExistingOnProject(
    userId,
    projectId
  );

  if (!findExistingUser) {
    return res.status(401).send({ error: "User is not on the project" });
  }
  if (findExistingUser.role !== Role.manager) {
    return res.status(401).send({ error: "Manager role required" });
  }
  const deletedProject = await deleteProject(projectId);

  res.status(200).send(deletedProject);
});

projectsRouter.put("/:pid(\\d+)", authenticate, async (req, res) => {
  const projectId = parseInt(req.params.pid);
  const userId = req.session.userId!;
  const { name } = req.body;

  if (!name) {
    return res.status(400).send({ error: "Missing project name" });
  }

  const project = await getProjectById(projectId);
  if (!project) {
    return res.status(404).send({ error: "Couldnt find project" });
  }

  const findExistingUser = await checkForUserExistingOnProject(
    userId,
    projectId
  );

  if (!findExistingUser) {
    return res.status(401).send({ error: "User is not on the project" });
  }
  if (findExistingUser.role !== Role.manager) {
    return res.status(401).send({ error: "Manager role required" });
  }

  const updatedProject = await updateProject(projectId, name);
  res.json(updatedProject);
});

projectsRouter.get("/:pid(\\d+)", authenticate, async (req, res) => {
  const projectId = parseInt(req.params.pid);
  const userId = req.session.userId!;
  const project = await getProjectById(projectId);
  if (!project) {
    return res.status(404).send({ error: "Couldnt find project" });
  }
  const findExistingUser = await checkForUserExistingOnProject(
    userId,
    projectId
  );

  if (!findExistingUser) {
    return res.status(401).send({ error: "User is not on the project" });
  }

  const allProjectDetails = await getProjectAllDetailsById(projectId);
  res.json(allProjectDetails);
});

projectsRouter.post(
  "/:pid(\\d+)/users/:uid(\\d+)",
  authenticate,
  async (req, res) => {
    const projectId = parseInt(req.params.pid);
    const userId = parseInt(req.params.uid);
    const sessionUserId = req.session.userId!;
    const { role } = req.body;
    if (!role) {
      return res.status(400).send({ error: "Missing role" });
    }
    if (role !== Role.manager && role !== Role.editor && role !== Role.viewer) {
      return res.status(400).send({ error: "Wrong role" });
    }
    const findUser = await getUserById(userId);
    if (!findUser) {
      return res.status(404).send({ error: "Couldnt find user" });
    }
    const findProject = await getProjectById(projectId);
    if (!findProject) {
      return res.status(404).send({ error: "Couldnt find project" });
    }
    const findExistingUser = await checkForUserExistingOnProject(
      userId,
      projectId
    );

    if (findExistingUser) {
      return res.status(400).send({ error: "User is already on this project" });
    }

    const findSessionUser = await checkForUserExistingOnProject(
      sessionUserId,
      projectId
    );

    if (!findSessionUser) {
      return res
        .status(400)
        .send({ error: "Session holder is not on this project" });
    }

    if (findSessionUser.role !== Role.manager) {
      return res.status(401).send({ error: "Manager role required" });
    }

    const newUserToProject = await addUserToProject(userId, projectId, role);

    res.json(newUserToProject);
  }
);

projectsRouter.put(
  "/:pid(\\d+)/users/:uid(\\d+)",
  authenticate,
  async (req, res) => {
    const projectId = parseInt(req.params.pid);
    const userId = parseInt(req.params.uid);
    const sessionUserId = req.session.userId!;
    const { role } = req.body;
    if (!role) {
      return res.status(400).send({ error: "Missing role" });
    }

    if (role !== Role.manager && role !== Role.editor && role !== Role.viewer) {
      return res.status(400).send({ error: "Wrong role" });
    }

    const findUser = await getUserById(userId);
    if (!findUser) {
      return res.status(404).send({ error: "Couldnt find user" });
    }
    const findProject = await getProjectById(projectId);
    if (!findProject) {
      return res.status(404).send({ error: "Couldnt find project" });
    }
    const findExistingUser = await checkForUserExistingOnProject(
      userId,
      projectId
    );
    if (!findExistingUser) {
      return res.status(400).send({ error: "User is not on the project" });
    }

    const findSessionUser = await checkForUserExistingOnProject(
      sessionUserId,
      projectId
    );

    if (!findSessionUser) {
      return res
        .status(400)
        .send({ error: "Session holder is not on this project" });
    }

    if (findSessionUser.role !== Role.manager) {
      return res.status(401).send({ error: "Manager role required" });
    }

    const newUserRoleToProject = await changeUserRoleOnProject(
      userId,
      projectId,
      role
    );

    res.json(newUserRoleToProject);
  }
);

projectsRouter.delete(
  "/:pid(\\d+)/users/:uid(\\d+)",
  authenticate,
  async (req, res) => {
    const projectId = parseInt(req.params.pid);
    const userId = parseInt(req.params.uid);
    const sessionUserId = req.session.userId!;
    const findUser = await getUserById(userId);
    if (!findUser) {
      return res.status(404).send({ error: "Couldnt find user" });
    }
    const findProject = await getProjectById(projectId);
    if (!findProject) {
      return res.status(404).send({ error: "Couldnt find project" });
    }

    const findExistingUser = await checkForUserExistingOnProject(
      userId,
      projectId
    );
    if (!findExistingUser) {
      return res.status(400).send({ error: "User is not on the project" });
    }

    const findSessionUser = await checkForUserExistingOnProject(
      sessionUserId,
      projectId
    );

    if (!findSessionUser) {
      return res
        .status(400)
        .send({ error: "Session holder is not on this project" });
    }

    if (findSessionUser.role !== Role.manager) {
      return res.status(401).send({ error: "Manager role required" });
    }

    const deletedUserFromProject = await removeUserFromProject(
      userId,
      projectId
    );

    res.json(deletedUserFromProject);
  }
);
export default projectsRouter;
