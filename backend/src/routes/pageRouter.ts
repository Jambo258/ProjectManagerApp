import { Router, type Request } from "express";
import { Role } from "@prisma/client";
import * as yup from "yup";
import validate from "../middlewares/validate.js";
import {
  getpageById,
  createPage,
  updatePageName,
  deletePage,
} from "../services/pageService.js";
import { checkForUserExistingOnProject } from "../services/projectService.js";

const pagesRouter = Router();

interface RequestBody<T> extends Request {
  body: T;
}

const createPageSchema = yup.object({
  name: yup
    .string()
    .required()
    .trim()
    .min(2, "Must be at least 2 characters long")
    .max(50, "Must be less than 50 characters long"),
  projectid: yup
    .number()
    .required(),
});
type createPageSchemaType = yup.InferType<typeof createPageSchema>;

export const pageNameSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(2, "Must be at least 2 characters long")
    .max(50, "Must be less than 50 characters long")
    .required("Project name is required"),
});

export type pageNameSchemaType = yup.InferType<typeof pageNameSchema>;

pagesRouter.get("/:id(\\d+)", async (req, res, next) => {
  try {
    const userid = req.session.userId!;
    const foundPage = await getpageById(Number(req.params.id));

    if (!foundPage) {
      return res.status(404).json({ error: "Page not found" });
    }

    const findUser = await checkForUserExistingOnProject(userid, foundPage.projectid);

    if (!findUser) {
      return res.status(401).json({ error: "User is not on the project" });
    }

    return res.status(200).json(foundPage);
  } catch (error) {
    next(error);
  }
});

pagesRouter.post("/", validate(createPageSchema), async (req: RequestBody<createPageSchemaType>, res, next) => {
  try {
    const { name, projectid } = req.body;
    const userid = req.session.userId!;

    if (
      !name ||
      !projectid ||
      typeof name !== "string" ||
      typeof projectid !== "number"
    ) {
      return res.status(400).json({ error: "Missing name or projectid" });
    }

    const findUser = await checkForUserExistingOnProject(userid, projectid);

    if (!findUser) {
      return res.status(401).json({ error: "You are not on this project" });
    }

    if (findUser.role !== Role.editor && findUser.role !== Role.manager) {
      return res.status(401).json({ error: "Manager or editor role required" });
    }

    const newPage = await createPage(name, projectid);
    return res.status(200).json(newPage);
  } catch (error) {
    next(error);
  }
});

pagesRouter.delete("/:id(\\d+)", async (req, res, next) => {
  try {
    const userid = req.session.userId!;
    const pageId = Number(req.params.id);
    const foundPage = await getpageById(pageId);

    if (!foundPage)
      return res.status(404).json({ error: "Page doesn't exist" });

    const findUser = await checkForUserExistingOnProject(userid, foundPage.projectid);

    if (!findUser) {
      return res.status(401).json({ error: "You are not on this project" });
    }

    if (findUser.role !== Role.manager) {
      return res.status(401).json({ error: "Manager role required" });
    }

    const page = await deletePage(pageId);
    return res.status(200).json({ id: page.id });
  } catch (error) {
    next(error);
  }
});

pagesRouter.put("/:id(\\d+)", validate(pageNameSchema), async (req: RequestBody<pageNameSchemaType>, res, next) => {
  try {
    const { name } = req.body;
    const pageId = Number(req.params.id);
    const userid = req.session.userId!;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Missing name" });
    }

    const foundPage = await getpageById(pageId);
    if (!foundPage) {
      return res.status(404).json({ error: "Page doesn't exist" });
    }

    const findUser = await checkForUserExistingOnProject(userid, foundPage.projectid);
    if (!findUser) {
      return res.status(401).json({ error: "You are not on this project" });
    }

    if (findUser.role !== Role.editor && findUser.role !== Role.manager) {
      return res.status(401).json({ error: "Manager or editor role required" });
    }

    const updatedPage = await updatePageName(pageId, name);
    return res.status(200).json(updatedPage);
  } catch (error) {
    next(error);
  }
});

export default pagesRouter;
