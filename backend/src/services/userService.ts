import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createUser = async (email: string, name: string, password: string) => {
  const newUser = await prisma.users.create({
    data: {
      email,
      name,
      password,
    },
  });

  return newUser;
};

const getAllUsers = async () => {
  const users = await prisma.users.findMany();
  return users;
};

const getUserById = async (id: number) => {
  const user = await prisma.users.findUnique({
    where: { id },
  });

  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: { email },
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
  });

  return updatedUser;
};

const deleteUser = async (id: number) => {
  const deletedUser = await prisma.users.delete({
    where: { id },
  });

  return deletedUser;
};

export {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
