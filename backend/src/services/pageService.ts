import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getpageById(id: number) {
  const page = await prisma.pages.findUnique({
    where: { id: id },
  });
  return page;
}

export async function createPage(name: string, projectid: number) {
  const newPage = await prisma.pages.create({
    data: { name: name, projectid: projectid },
  });
  return newPage;
}

export async function updatePage(id: number, name: string, projectid: number) {
  const page = await prisma.pages.update({
    where: { id: id },
    data: { name: name, projectid: projectid },
  });
  return page;
}

export async function deletePage(id: number) {
  const page = await prisma.pages.delete({
    where: { id },
  });
  return page;
}