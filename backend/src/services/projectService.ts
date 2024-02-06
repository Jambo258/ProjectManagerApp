import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const createNewProject = async (name: string, id: number) => {
  const newProject = await prisma.projects.create({
    data: {
      name,
    },
  });

  await prisma.projectUsers.create({
    data: {
      userid: id,
      projectid: newProject.id,
      role: Role.manager,
    },
  });

  return newProject;
};

const getAllProjectsAndPagesByUserId = async (id: number) => {
  const projects = await prisma.projects.findMany({
    where: {
      users: {
        some: {
          userid: id,
        }
      },
    },
    select: {
      id: true,
      name: true,
      updated_at: true,
      created_at: true,
      // TODO Is users needed here?
      users: {
        select: {
          userid: true,
          role: true,
        },
      },
      pages: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return projects;
};

const getProjectById = async (id: number) => {
  const project = await prisma.projects.findUnique({
    where: { id },
  });

  return project;
};

const getProjectAllDetailsById = async (id: number) => {
  const project = await prisma.projects.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      updated_at: true,
      created_at: true,
      users: {
        select: {
          role: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            }
          }
        },
      },
      pages: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!project) {
    return project;
  }

  const flatUsers = project.users.map(user => {
    return { ...user.user, role: user.role };
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { users, ...projectWithoutUsers } = project;

  const flatProject = { ...projectWithoutUsers, users: flatUsers };
  return flatProject;
};

const updateProject = async (id: number, name: string) => {
  const updatedProject = await prisma.projects.update({
    where: { id },
    data: {
      name,
      updated_at: new Date(),
    },
  });

  return updatedProject;
};

const deleteProject = async (id: number) => {
  const deletedProject = await prisma.projects.delete({
    where: { id },
  });

  return deletedProject;
};

const addUserToProject = async (
  userId: number,
  projectId: number,
  role: Role
) => {
  const newProjectUser = await prisma.projectUsers.create({
    data: {
      userid: userId,
      projectid: projectId,
      role: role,
    },
  });

  return newProjectUser;
};

const changeUserRoleOnProject = async (
  userId: number,
  projectId: number,
  role: Role
) => {
  const projectUserRoleChanged = await prisma.projectUsers.update({
    where: { projectid_userid: { userid: userId, projectid: projectId } },

    data: {
      role: role,
      updated_at: new Date(),
    },
  });

  return projectUserRoleChanged;
};

const removeUserFromProject = async (userId: number, projectId: number) => {
  const deletedUserFromProject = await prisma.projectUsers.delete({
    where: {
      projectid_userid: { userid: userId, projectid: projectId },
    },
  });

  const remainingUsers = await getProjectAllDetailsById(projectId);

  if (remainingUsers?.users.length === 0) {
    await prisma.projects.delete({
      where: { id: projectId },
    });
  }

  return deletedUserFromProject;
};

const checkForUserExistingOnProject = async (
  userId: number,
  projectId: number
) => {
  const findExistingUser = await prisma.projectUsers.findUnique({
    where: { projectid_userid: { userid: userId, projectid: projectId } },
  });
  return findExistingUser;
};

export {
  createNewProject,
  getAllProjectsAndPagesByUserId,
  getProjectById,
  getProjectAllDetailsById,
  updateProject,
  deleteProject,
  addUserToProject,
  changeUserRoleOnProject,
  removeUserFromProject,
  checkForUserExistingOnProject,
};
