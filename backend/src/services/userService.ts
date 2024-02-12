import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const selectUserFields = {
  id: true,
  email: true,
  name: true,
};

const createUser = async (email: string, name: string, password: string) => {
  const newUser = await prisma.users.create({
    data: {
      email,
      name,
      password,
    },
    select: selectUserFields,
  });

  return newUser;
};

const getUserById = async (id: number) => {
  const user = await prisma.users.findUnique({
    where: { id },
    select: selectUserFields,
  });

  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: { email },
    select: selectUserFields,
  });

  return user;
};

const getUserByEmailLogin = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true
    }
  });

  return user;
};

interface dataType {
  email?: string,
  name?: string,
  password?: string,
}

const updateUser = async (id: number, data: dataType) => {
  const updatedUser = await prisma.users.update({
    where: { id },
    data,
    select: selectUserFields,
  });

  return updatedUser;
};

const deleteUser = async (id: number) => {
  const deletedUser = await prisma.users.delete({
    where: { id },
    select: selectUserFields,
  });

  return deletedUser;
};

export {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByEmailLogin,
  updateUser,
  deleteUser,
};
