import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const getpageById = async (id: number) => {
  return await prisma.pages.findUnique({
    where: { id: id },
    select: {
      id: true,
      name: true,
      projectid: true,
    }
  });
};

const getPageContent = async (id: number) => {
  return await prisma.pages.findUnique({
    where: { id: id },
    select: {
      content: true,
    }
  });
};

const createPage = async (name: string, projectid: number) => {
  return await prisma.pages.create({
    data: { name: name, projectid: projectid },
    select: {
      id: true,
      name: true,
      projectid: true,
    }
  });
};

const updatePageName = async (id: number, name: string) => {
  return await prisma.pages.update({
    where: { id: id },
    data: { name: name },
    select: { id: true, name: true }
  });
};

const updatePageContent = async (id: number, content: Buffer) => {
  return await prisma.pages.update({
    where: { id: id },
    data: { content: content },
    select: {
      id: true,
      name: true,
      projectid: true,
      content: true
    }
  });
};

const deletePage = async (id: number) => {
  return await prisma.pages.delete({
    where: { id },
    select: {
      id: true,
    }
  });
};

const canEditPage = async (userId: number, pageId: number) => {
  return !!await prisma.projects.findFirst({
    where: {
      users: {
        some: {
          userid: userId,
          OR: [
            { role: Role.manager },
            { role: Role.editor }
          ],
        },
      },
      pages: {
        some: { id: pageId },
      }
    },
  });
};

const canViewPage = async (userId: number, pageId: number) => {
  return !!await prisma.projects.findFirst({
    where: {
      users: {
        some: {
          userid: userId,
        },
      },
      pages: {
        some: { id: pageId },
      }
    },
  });
};

export {
  getpageById,
  getPageContent,
  createPage,
  updatePageName,
  updatePageContent,
  deletePage,
  canEditPage,
  canViewPage,
};
