import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const getpageById = async (id: number) => {
  return await prisma.pages.findUnique({
    where: { id: id },
  });
};

const createPage = async (name: string, projectid: number) => {
  return await prisma.pages.create({
    data: { name: name, projectid: projectid },
  });
};

const updatePageName = async (id: number, name: string) => {
  return await prisma.pages.update({
    where: { id: id },
    data: { name: name },
  });
};

const updatePageContent = async (id: number, content: Buffer) => {
  return await prisma.pages.update({
    where: { id: id },
    data: { content: content },
  });
};

const deletePage = async (id: number) => {
  return await prisma.pages.delete({
    where: { id },
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

export {
  getpageById,
  createPage,
  updatePageName,
  updatePageContent,
  deletePage,
  canEditPage,
};
