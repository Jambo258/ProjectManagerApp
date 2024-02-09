/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { agent } from "supertest";
import { it, describe, beforeAll, afterAll, expect } from "vitest";
import app from "../src/server.js";

const manager = agent(app);
const viewer = agent(app);
const editor = agent(app);
const dummyUser = agent(app);

const noUser = agent(app);

let projectid = 0;
let pageid = 0;

beforeAll(async () => {
  await viewer.post("/users/register").send({
    email: "authTesting1@mail.com",
    name: "test",
    password: "Salasana1!",
  });

  await editor.post("/users/register").send({
    email: "authTesting22@mail.com",
    name: "test2",
    password: "Salasana1!",
  });

  await manager.post("/users/register").send({
    email: "testing@mail.com",
    name: "pekka",
    password: "Salasana1!"
  });

  await dummyUser.post("/users/register").send({
    email: "dummy12345@mail.com",
    name: "pekka",
    password: "Salasana1!"
  });

  const testProject = await manager
    .post("/projects/")
    .send({ name: "testproject2" });

  projectid = testProject.body.id;

  await manager
    .post(`/projects/${projectid}/users/`)
    .send({ role: "viewer", email: "authTesting1@mail.com" });

  await manager
    .post(`/projects/${projectid}/users/`)
    .send({ role: "editor", email: "authTesting22@mail.com" });
});

afterAll(async () => {
  await manager
    .post("/users/login")
    .send({ email: "testing@mail.com", password: "Salasana1!" });
  await manager.delete("/pages/" + pageid);
  await manager.delete("/projects/" + projectid);
  await manager.delete("/users/delete");
  await viewer.delete("/users/delete");
  await editor.delete("/users/delete");
  await dummyUser.delete("/users/delete");
});

describe("server", () => {
  it("create new page", async () => {
    const res = await manager
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid })
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
    expect(res.body.error).toBeDefined();
  });

  it("try to create page with missing projectid", async () => {
    const res = await manager
      .post("/pages/")
      .send({ name: "pagetest" })
      .expect(400)
      .expect("content-type", /json/);
    expect(res.body.error).toBeDefined();
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
      .send({ name: "pagetestupdate" })
      .expect(404);
    expect(res.body.error).toEqual("Not Found");
  });

  it("update page with missing name", async () => {
    const res = await manager
      .put("/pages/" + pageid)
      .send({})
      .expect(400);
    expect(res.body.error).toBeDefined();
  });

  it("update page with page not existing", async () => {
    const res = await manager
      .put("/pages/" + 344444)
      .send({ name: "pagetestupdate" })
      .expect(404);
    expect(res.body.error).toEqual("Page doesn't exist");
  });

  it("try to create new page as viewer", async () => {
    const res = await viewer
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid })
      .expect(401)
      .expect("content-type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("try to update page as viewer", async () => {
    const res = await viewer
      .put("/pages/" + pageid)
      .send({ name: "pagetestupdate" })
      .expect(401);
    expect(res.body.error).toBeDefined();
  });

  it("try to get page without belonging to project", async () => {
    const res = await dummyUser
      .get("/pages/" + pageid)
      .expect(401)
      .expect("content-type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("try to create new page without belonging to project", async () => {
    const res = await dummyUser
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid })
      .expect(401)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("You are not on this project");
  });

  it("try to update page without belonging to project", async () => {
    const res = await dummyUser
      .put("/pages/" + pageid)
      .send({ name: "pagetestupdate" })
      .expect(401);
    expect(res.body.error).toEqual("You are not on this project");
  });

  it("try to delete page without belonging to project", async () => {
    const res = await dummyUser
      .delete("/pages/" + pageid)
      .expect(401);
    expect(res.body.error).toEqual("You are not on this project");
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
      .send({ name: "pagetestupdate" })
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
    expect(res.body.error).toBeDefined();
  });

  it("create new page", async () => {
    const res = await manager
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid });
    pageid = res.body.id;
  });

  it("try to delete page as viewer", async () => {
    const res = await viewer
      .delete("/pages/" + pageid)
      .expect(401);
    expect(res.body.error).toBeDefined();
  });

  it("create new page", async () => {
    const res = await manager
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid });
    pageid = res.body.id;
  });

  it("delete page", async () => {
    const res = await manager
      .delete("/pages/" + pageid)
      .expect(200);
    expect(res.body.id);
  });

  it("get INT32_MAX + 1", async () => {
    await dummyUser
      .get("/pages/" + (2147483647 + 1))
      .expect(500);
  });

  it("put INT32_MAX + 1", async () => {
    await dummyUser
      .put("/pages/" + (2147483647 + 1))
      .send({ name: "pagetestupdate" })
      .expect(500);
  });

  it("delete INT32_MAX + 1", async () => {
    await dummyUser
      .delete("/pages/" + (2147483647 + 1))
      .expect(500);
  });
});
