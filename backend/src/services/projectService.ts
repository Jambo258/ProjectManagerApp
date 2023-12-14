import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export async function createNewProject(name: string) {
  const newProject = await prisma.projects.create({
    data: {
      name,
    },
  });
  // edit user id later
  const userId = 1;
  await prisma.projectUsers.create({
    data: {
      userid: userId,
      projectid: newProject.id,
      role: Role.manager,
    },
  });

  return newProject;
}

export async function getAllProjectsByUserId(id: number) {
  const projects = await prisma.projects.findMany({
    where: {
      users: {
        some: {
          userid: id,
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
  const project = await prisma.projectUsers.findMany({
    where: { projectid: id },
    include: {
      project: {
        select: {
          name: true,
        },
      },
    },
  });

  return project;
}

export async function updateProject(id: number, name: string ) {
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
      updated_at: new Date()
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

  if (remainingUsers.length === 0) {
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
