import { Router } from "express";
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
  getUserByEmailLogin,
} from "../services/userService.js";
import { type RequestBody } from "../types/types.js";

const usersRouter = Router();

const registerUserSchema = yup.object({
  email: yup.string().trim().required("email is required").email("Must be a valid email"),
  name: yup.string().trim().required("Name is required").min(2, "Name too short, minimum length is 2").max(50, "name too long, max length is 50"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Must be at least 6 characters long")
    .matches(/^(?=.*[a-z])/, "Password requires atleast 1 regural character")
    .matches(/^(?=.*[A-Z])/, "Password requires atleast 1 capital character")
    .matches(/^(?=.*[0-9])/, "Password requires atleast 1 number")
    .matches(/^(?=.*[!@#$%^&*])/, "Password requires atleast 1 special character"),
});
type RegisterUserSchemaType = yup.InferType<typeof registerUserSchema>;

usersRouter.post(
  "/register",
  validate(registerUserSchema),
  async (req: RequestBody<RegisterUserSchemaType>, res, next) => {
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
  email: yup.string().trim().required("Email is required").email("Must be a valid email"),
  password: yup.string().required("Password is required").min(6, "Must be at least 6 characters long"),
});
type LoginUserSchemaType = yup.InferType<typeof loginUserSchema>;

usersRouter.post(
  "/login",
  validate(loginUserSchema),
  async (req: RequestBody<LoginUserSchemaType>, res, next) => {
    try {
      const { email, password } = req.body;
      const findUser = await getUserByEmailLogin(email);
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
  email: yup.string().trim().required("Email is required").email("Must be a valid email"),
});
type GetUserByEmailSchemaType = yup.InferType<typeof getUserByEmailSchema>;

usersRouter.post(
  "/getuserbyemail",
  authenticate,
  validate(getUserByEmailSchema),
  async (req: RequestBody<GetUserByEmailSchemaType>, res, next) => {
    try {
      const { email } = req.body;
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
  email: yup.string().trim().optional().email("Must be a valid email"),
  name: yup.string().trim().optional().min(2, "Must be at least 2 characters long").max(50, "Must be shorter than 50 characters"),
  password: yup.string()
    .optional()
    .min(6, "Must be at least 6 characters long")
    .matches(/^(?=.*[a-z])/, "Password requires atleast 1 regural character")
    .matches(/^(?=.*[A-Z])/, "Password requires atleast 1 capital character")
    .matches(/^(?=.*[0-9])/, "Password requires atleast 1 number")
    .matches(/^(?=.*[!@#$%^&*])/, "Password requires atleast 1 special character"),
});
type UpdateUserSchemaType = yup.InferType<typeof updateUserSchema>;

usersRouter.put(
  "/update",
  authenticate,
  validate(updateUserSchema),
  async (req: RequestBody<UpdateUserSchemaType>, res, next) => {
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

      const updatedUserData: UpdateUserSchemaType = {};

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
