import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export async function createNewProject(name: string, id: number) {
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
}

export async function getAllProjectsAndPagesByUserId(id: number) {
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
}

export async function getProjectById(id: number) {
  const project = await prisma.projects.findUnique({
    where: { id },
  });

  return project;
}

export async function getProjectAllDetailsById(id: number) {
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
          userid: true,
          role: true,
          user: {
            select: {
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

  return project;
}

export async function updateProject(id: number, name: string) {
  const updatedProject = await prisma.projects.update({
    where: { id },
    data: {
      name,
      updated_at: new Date(),
    },
  });

  return updatedProject;
}

export async function deleteProject(id: number) {
  const deletedProject = await prisma.projects.delete({
    where: { id },
  });

  return deletedProject;
}

export async function addUserToProject(
  userId: number,
  projectId: number,
  role: Role
) {
  const newProjectUser = await prisma.projectUsers.create({
    data: {
      userid: userId,
      projectid: projectId,
      role: role,
    },
  });

  return newProjectUser;
}

export async function changeUserRoleOnProject(
  userId: number,
  projectId: number,
  role: Role
) {
  const projectUserRoleChanged = await prisma.projectUsers.update({
    where: { projectid_userid: { userid: userId, projectid: projectId } },

    data: {
      role: role,
      updated_at: new Date(),
    },
  });

  return projectUserRoleChanged;
}

export async function removeUserFromProject(userId: number, projectId: number) {
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
}

export async function checkForUserExistingOnProject(
  userId: number,
  projectId: number
) {
  const findExistingUser = await prisma.projectUsers.findUnique({
    where: { projectid_userid: { userid: userId, projectid: projectId } },
  });
  return findExistingUser;
}
