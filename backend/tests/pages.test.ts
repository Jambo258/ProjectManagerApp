/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { agent } from "supertest";
import { it, describe, beforeAll, afterAll, expect } from "vitest";
import app from "../src/server.js";

const manager = agent(app);
const viewer = agent(app);
const editor = agent(app);

const noUser = agent(app);

let projectid = 0;
let pageid = 0;
let managerID = 0;
let editorID = 0;
let viewerID = 0;


beforeAll(async () => {
  const resViewer = await viewer.post("/users/register").send({
    email: "authTesting1@mail.com",
    name: "test",
    password: "salainen",
  });

  const resEditor = await editor.post("/users/register").send({
    email: "authTesting22@mail.com",
    name: "test2",
    password: "salainen",
  });

  const resManager = await manager.post("/users/register").send({
    email: "testing@mail.com",
    name: "pekka",
    password: "salainen"
  });


  managerID = resManager.body.id;
  editorID = resEditor.body.id;
  viewerID = resViewer.body.id;


  const testProject = await manager
    .post("/projects/")
    .send({ name: "testproject2" });

  projectid = testProject.body.id;

  await manager
    .post(`/projects/${projectid}/users/${managerID}`)
    .send({ role: "manager" });

  await viewer
    .post(`/projects/${projectid}/users/${viewerID}`)
    .send({ role: "viewer" });

  await editor
    .post(`/projects/${projectid}/users/${editorID}`)
    .send({ role: "editor" });
});

afterAll(async () => {
  await manager
    .post("/users/login")
    .send({ email: "testing@mail.com", password: "salainen" });
  await manager.delete("/users/delete/" + projectid);
  await manager.delete("/pages/delete/" + pageid);
  await manager.delete("/users/delete");
  await viewer.delete("/users/delete");
  await editor.delete("/users/delete");
});

describe("server", () => {

  it("create new page", async () => {
    const res = await manager
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid, content: [{}] })
      .expect(200)
      .expect("content-type", /json/);
    expect(res.body.id);
    pageid = res.body.id;
  });

  it("try to create page with missing name", async () => {
    const res = await manager
      .post("/pages/")
      .send({ projectid: projectid })
      .expect(400)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("missing parameters");
  });

  it("try to create page with missing projectid", async () => {
    const res = await manager
      .post("/pages/")
      .send({ name: "pagetest" })
      .expect(400)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("missing parameters");
  });

  it("get page by id", async () => {
    const res = await manager
      .get("/pages/" + pageid)
      .expect(200)
      .expect("content-type", /json/);
    expect(res);
  });

  it("get page by wrong id", async () => {
    const res = await manager
      .get("/pages/100000000")
      .expect(404)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("Page not found");
  });

  it("try to get page with no id", async () => {
    const res = await manager
      .get("/pages/")
      .expect(404)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("Not Found");
  });

  it("update page", async () => {
    const res = await manager
      .put("/pages/" + pageid)
      .send({ name: "pagetestupdate" })
      .expect(200);
    expect(res.body.id);
  });

  it("update page with no id", async () => {
    const res = await manager
      .put("/pages/")
      .send({ name: "pagetestupdate"})
      .expect(404);
    expect(res.body.error).toEqual("Not Found");
  });

  it("try to create new page as viewer", async () => {
    const res = await viewer
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid, content: [{}] })
      .expect(401)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("missing role");
  });

  it("try to update page as viewer", async () => {
    const res = await viewer
      .put("/pages/" + pageid)
      .send({ name: "pagetestupdate"})
      .expect(401);
    expect(res.body.error).toEqual("missing role");
  });

  it("try to get page without logging in", async () => {
    const res = await noUser
      .get("/pages/" + pageid)
      .expect(401)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("Unauthorized");
  });

  it("try to create new page without logging in", async () => {
    const res = await noUser
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid })
      .expect(401)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("Unauthorized");
  });

  it("try to update page without logging in", async () => {
    const res = await noUser
      .put("/pages/" + pageid)
      .send({ name: "pagetestupdate"})
      .expect(401);
    expect(res.body.error).toEqual("Unauthorized");
  });

  it("try to delete page with no id", async () => {
    const res = await manager
      .delete("/pages/")
      .expect(404);
    expect(res.body.error).toEqual("Not Found");
  });

  it("try to delete page without logging in", async () => {
    const res = await noUser
      .delete("/pages/" + pageid)
      .expect(401);
    expect(res.body.error).toEqual("Unauthorized");
  });

  it("try to delete page as editor", async () => {
    const res = await editor
      .delete("/pages/" + pageid)
      .expect(401);
    expect(res.body.error).toEqual("missing role");
  });

  it("create new page", async () => {
    const res = await manager
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid, content: [{}] });
    pageid = res.body.id;
  });

  it("try to delete page as viewer", async () => {
    const res = await viewer
      .delete("/pages/" + pageid)
      .expect(401);
    expect(res.body.error).toEqual("missing role");
  });

  it("create new page", async () => {
    const res = await manager
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid, content: [{}] });
    pageid = res.body.id;
  });

  it("delete page", async () => {
    const res = await manager
      .delete("/pages/" + pageid)
      .expect(200);
    expect(res.body.id);
  });
});
