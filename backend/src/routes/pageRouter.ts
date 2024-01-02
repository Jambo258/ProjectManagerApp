import { Router } from "express";
import {
  getpageById,
  createPage,
  updatePage,
  deletePage,
} from "../services/pageService.js";
import { checkForUserExistingOnProject } from "../services/projectService.js";
import { Role } from "@prisma/client";

const pagesRouter = Router();

pagesRouter.get("/:id(\\d+)", async (req, res, next) => {
  try {
    const { projectid  } = req.body;
    const userid = req.session.userId!;
    if ( !projectid || typeof projectid !== "number" || !req.params.id)
    {
      return res.status(400).json({error: "missing parameters."});
    }

    const findUser = await checkForUserExistingOnProject(userid, projectid);

    if(!findUser) res.status(404).json({error: "user not found on project"});
    if(!findUser?.role) res.status(401).json({error: "missing role"});


    const foundPage = await getpageById(parseInt(req.params.id));
    if (!foundPage) return res.status(404).json({ error: "Page not found" });

    return res.status(200).json(foundPage);
  } catch (error) {
    next(error);
  }
});

pagesRouter.post("/", async (req, res, next) => {
  try {
    const { name, projectid, content  }: {name: string, projectid: number, content: string} = req.body;
    const userid = req.session.userId!;

    if (!name || !projectid || typeof name !== "string" || typeof projectid !== "number" )
    {
      return res.status(400).json({error: "missing parameters."});
    }

    const findUser = await checkForUserExistingOnProject(userid, projectid);

    if(!findUser) res.status(404).json({error: "user not found on project"});
    if(findUser?.role !== Role.manager) res.status(401).json({error: "missing correct role"});

    const newPage = await createPage(name, projectid, content);
    return res.status(200).json(newPage);
  } catch (error) {
    next(error);
  }
});

pagesRouter.delete("/:id(\\d+)", async (req, res, next) => {
  try {

    const { projectid } = req.body;
    const userid = req.session.userId!;

    if ( !projectid || typeof projectid !== "number" || !req.params.id)
    {
      return res.status(400).json({error: "missing parameters."});
    }

    const findUser = await checkForUserExistingOnProject(userid, projectid);

    if(!findUser) res.status(404).json({error: "user not found on project"});
    if(findUser?.role !== Role.manager) res.status(401).json({error: "missing correct role"});

    const foundPage = await getpageById(parseInt(req.params.id));
    console.log(req.params.id);
    if (!foundPage) return res.status(404).json({ error: "page doesn't exist." });

    const page = await deletePage(parseInt(req.params.id));
    return res.status(200).json({ id: page.id });
  } catch (error) {
    next(error);
  }
});

pagesRouter.put("/:id(\\d+)", async (req, res, next) => {
  try {
    const { name, projectid, content  }: {name: string, projectid: number, content: string}  = req.body;
    const userid = req.session.userId!;

    if (!name || !projectid || typeof name !== "string" ||typeof projectid !== "number" )
      return res.status(400).json({error: "missing parameters."});

    const findUser = await checkForUserExistingOnProject(userid, projectid);

    if(!findUser) res.status(404).json({error: "user not found on project"});
    if(findUser?.role !== Role.manager) res.status(401).json({error: "missing correct role"});

    const foundPage = await getpageById(parseInt(req.params.id));
    if (!foundPage) return res.status(404).json({ error: "page doesn't exist." });

    const updatedPage = await updatePage(parseInt(req.params.id), name, projectid, content);
    return res.status(200).json(updatedPage);
  } catch (error) {
    next(error);
  }
});

export default pagesRouter;
