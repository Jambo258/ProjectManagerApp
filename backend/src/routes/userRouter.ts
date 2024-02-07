import { Router, type Request } from "express";
import argon2 from "argon2";
import * as yup from "yup";
import authenticate from "../middlewares/authenticate.js";
import validate from "../middlewares/validate.js";
import {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} from "../services/userService.js";

const usersRouter = Router();

interface RequestBody<T> extends Request {
  body: T;
}

const registerUserSchema = yup.object({
  email: yup.string().required().email(),
  name: yup.string().required().trim().min(2).max(50),
  password: yup.string().required().min(6),
});
type registerUserSchemaType = yup.InferType<typeof registerUserSchema>;

usersRouter.post(
  "/register",
  validate(registerUserSchema),
  async (req: RequestBody<registerUserSchemaType>, res, next) => {
    try {
      const { email, name, password } = req.body;

      const findUser = await getUserByEmail(email);
      if (findUser) {
        return res.status(409).json({
          error: "This email is already in use. Please use another one.",
        });
      }

      const hash = await argon2.hash(password);
      const newUser = await createUser(email, name, hash);

      req.session.regenerate((err) => {
        if (err) {
          return next(err);
        }
        req.session.userId = newUser.id;
        return res.status(200).json(newUser);
      });
    } catch (err) {
      next(err);
    }
  }
);

const loginUserSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
});
type loginUserSchemaType = yup.InferType<typeof loginUserSchema>;

usersRouter.post(
  "/login",
  validate(loginUserSchema),
  async (req: RequestBody<loginUserSchemaType>, res, next) => {
    try {
      const { email, password } = req.body;

      if (
        !email ||
        !password ||
        typeof email !== "string" ||
        typeof password !== "string"
      ) {
        return res.status(400).json({ error: "Missing email or password" });
      }

      const findUser = await getUserByEmail(email);
      if (findUser && (await argon2.verify(findUser.password, password))) {
        req.session.regenerate((err) => {
          if (err) {
            return next(err);
          }
          req.session.userId = findUser.id;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userDetails } = findUser;
          return res.status(200).json(userDetails);
        });
      } else {
        return res
          .status(401)
          .json({ error: "Email and password does not match" });
      }
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.clearCookie("connect.sid", { path: "/" });
    if (err) {
      return next(err);
    }
    return res.status(204).end();
  });
});

const getUserByEmailSchema = yup.object({
  email: yup.string().required().email(),
});
type getUserByEmailSchemaType = yup.InferType<typeof getUserByEmailSchema>;

usersRouter.post(
  "/getuserbyemail",
  authenticate,
  validate(getUserByEmailSchema),
  async (req: RequestBody<getUserByEmailSchemaType>, res, next) => {
    try {
      const { email } = req.body;

      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Missing email" });
      }

      const user = await getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ error: "Couldn't find user" });
      }

      return res.status(200).json({ id: user.id });
    } catch (error) {
      next(error);
    }
  }
);

const updateUserSchema = yup.object({
  email: yup.string().optional().email(),
  name: yup.string().optional().trim().min(2).max(50),
  password: yup.string().optional().min(6),
});
type updateUserSchemaType = yup.InferType<typeof updateUserSchema>;

usersRouter.put(
  "/update",
  authenticate,
  validate(updateUserSchema),
  async (req: RequestBody<updateUserSchemaType>, res, next) => {
    try {
      const id = req.session.userId!;
      const { email, name, password } = req.body;

      if (!email && !password && !name) {
        return res
          .status(400)
          .json({ error: "Missing email, password or name" });
      }

      const user = await getUserById(id);
      if (!user) {
        return res.status(404).json({ error: "Couldn't find user" });
      }

      const updatedUserData: updateUserSchemaType = {};

      if (email) {
        const findEmail = await getUserByEmail(email);
        if (findEmail) {
          return res.status(409).json({
            error: "This email is already in use. Please use another one.",
          });
        }
        updatedUserData.email = email;
      }
      if (password) {
        updatedUserData.password = await argon2.hash(password);
      }
      if (name) {
        updatedUserData.name = name;
      }
      const updatedUser = await updateUser(id, updatedUserData);
      return res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.delete("/delete", authenticate, async (req, res, next) => {
  try {
    const id = req.session.userId!;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const deletedUser = await deleteUser(id);
    req.session.destroy((err) => {
      res.clearCookie("connect.sid", { path: "/" });
      if (err) {
        return next(err);
      }
      return res.status(200).json(deletedUser);
    });
  } catch (err) {
    next(err);
  }
});

export default usersRouter;
