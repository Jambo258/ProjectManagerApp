import { Router } from "express";
import {
  getpageById,
  createPage,
  updatePage,
  deletePage,
} from "../services/pageService.js";

const pagesRouter = Router();

pagesRouter.get("/:id(\\d+)", async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({error: "missing parameters."});

    const foundPage = await getpageById(parseInt(req.params.id));
    if (!foundPage) res.status(404).json({ error: "Page not found" });

    res.status(200).send(foundPage);
  } catch (error) {
    console.log(error);
  }
});

pagesRouter.post("/", async (req, res) => {
  const { name, project_id  } = req.body;

  try {
    if (!name || !project_id) return res.status(400).json({error: "missing parameters."});

    const newPage = await createPage(name, project_id);
    res.status(200).send(newPage);
  } catch (error) {
    console.log(error);
  }
});

pagesRouter.delete("/:id(\\d+)", async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({error: "missing parameters."});

    const foundPage = await getpageById(parseInt(req.params.id));
    if (!foundPage) res.status(404).json({ error: "page doesn't exist." });

    const page = await deletePage(parseInt(req.params.id));
    res.status(200).json({ id: page.id });
  } catch (error) {
    console.log(error);
  }
});

pagesRouter.put("/:id(\\d+)", async (req, res) => {
  const { name, project_id  } = req.body;
  try {
    if (!name || !project_id || !req.params.id) return res.status(400).json({error: "missing parameters."});

    const foundPage = await getpageById(parseInt(req.params.id));
    if (!foundPage) res.status(404).json({ error: "page doesn't exist." });

    const updatedPage = await updatePage(parseInt(req.params.id), name, project_id);
    res.status(200).send(`${updatedPage.name} updated.`);
  } catch (error) {
    console.log(error);
  }
});

export default pagesRouter;
