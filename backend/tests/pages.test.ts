/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { agent } from "supertest";
import { it, describe, beforeAll, afterAll, expect } from "vitest";
import server from "../src/server.js";

const user1 = agent(server);
const user2 = agent(server);
const noUser = agent(server);

let projectid = 0;
let pageid = 0;
let testUserID = 0;

beforeAll(async () => {
  await user2.post("/users/register").send({
    email: "authTesting@mail.com",
    name: "test",
    password: "salainen",
  });

  const resTest = await user1
    .post("/users/register")
    .send({ email: "testing@mail.com", name: "pekka", password: "salainen" });

  testUserID = resTest.body.id;

  const testProject = await user1
    .post("/projects/")
    .send({ name: "testproject2" });

  projectid = testProject.body.id;

  await user1
    .post(`/projects/${projectid}/users/${testUserID}`)
    .send({ role: "manager" });
});

afterAll(async () => {
  await user1
    .post("/users/login")
    .send({ email: "testing@mail.com", password: "salainen" });
  await user1.delete("/users/delete/" + projectid);
  await user1.delete("/pages/delete/" + pageid);
  await user1.delete("/users/delete");
});

describe("server", () => {
  //create page
  it("create new page", async () => {
    const res = await user1
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid })
      .expect(200)
      .expect("content-type", /json/);
    expect(res.body.id);
    pageid = res.body.id;
  });

  it("try to create page with missing name", async () => {
    const res = await user1
      .post("/pages/")
      .send({ projectid: projectid })
      .expect(400)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("missing parameters");
  });

  it("try to create page with missing projectid", async () => {
    const res = await user1
      .post("/pages/")
      .send({ name: "pagetest" })
      .expect(400)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("missing parameters");
  });

  //get page
  it("get page by id", async () => {
    const res = await user1
      .get("/pages/" + pageid)
      .expect(200)
      .expect("content-type", /json/);
    expect(res);
  });

  it("get page by wrong id", async () => {
    const res = await user1
      .get("/pages/100000000")
      .expect(404)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("Page not found");
  });

  it("try to get page with no id", async () => {
    const res = await user1
      .get("/pages/")
      .expect(404)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("Not Found");
  });

  //update page
  it("update page", async () => {
    const res = await user1
      .put("/pages/" + pageid)
      .send({ name: "pagetestupdate" })
      .expect(200);
    expect(res.body.id);
  });

  it("update page with no id", async () => {
    const res = await user1
      .put("/pages/")
      .send({ name: "pagetestupdate"})
      .expect(404);
    expect(res.body.error).toEqual("Not Found");
  });

  it("update page missing parameters", async () => {
    const res = await user1
      .put("/pages/" + pageid)
      .send({})
      .expect(400);
    expect(res.body.error).toEqual("missing parameters");
  });



  it("try to get page without role", async () => {
    const res = await user2
      .get("/pages/" + pageid)
      .expect(401)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("missing role");
  });

  it("try to create new page without role", async () => {
    const res = await user2
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid })
      .expect(401)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("missing role");
  });

  it("try to update page without role", async () => {
    const res = await user2
      .put("/pages/" + pageid)
      .send({ name: "pagetestupdate"})
      .expect(401);
    expect(res.body.error).toEqual("missing role");
  });

  it("try to delete page without role", async () => {
    const res = await user2
      .delete("/pages/" + pageid)
      .expect(401);
    expect(res.body.id);
  });

  it("set role to viewer", async () => {
    await user2
      .post(`/projects/${projectid}/users/${testUserID}`)
      .send({ role: "viewer" });
  });

  it("try to create new page as viewer", async () => {
    const res = await user2
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid })
      .expect(401)
      .expect("content-type", /json/);
    expect(res.body.error).toEqual("missing role");
  });

  it("try to update page as viewer", async () => {
    const res = await user2
      .put("/pages/" + pageid)
      .send({ name: "pagetestupdate"})
      .expect(401);
    expect(res.body.error).toEqual("missing role");
  });

  it("try to delete page as viewer", async () => {
    const res = await user2
      .delete("/pages/" + pageid)
      .expect(401);
    expect(res.body.id);
  });

  it("set role to editor", async () => {
    await user2
      .post(`/projects/${projectid}/users/${testUserID}`)
      .send({ role: "editor" });
  });

  it("try to delete page as editor", async () => {
    const res = await user2
      .delete("/pages/" + pageid)
      .expect(401);
    expect(res.body.id);
  });

  it("delete test account", async () => {
    await user2.delete("/users/delete");
  });

  it("try to get page without logging in", async () => {
    const res = await noUser
      .get("/pages/" + pageid)
      .expect(401)
      .expect("content-type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("try to create new page without logging in", async () => {
    const res = await noUser
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid })
      .expect(401)
      .expect("content-type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("try to update page without logging in", async () => {
    const res = await noUser
      .put("/pages/" + pageid)
      .send({ name: "pagetestupdate"})
      .expect(401);
    expect(res.body.error).toBeDefined();
  });

  it("try to delete page without logging in", async () => {
    const res = await noUser
      .delete("/pages/" + pageid)
      .expect(401);
    expect(res.body.error).toBeDefined();
  });

  //delete page
  it("delete page", async () => {
    const res = await user1
      .delete("/pages/" + pageid)
      .expect(200);
    expect(res.body.id);
  });

  it("try to delete page with no id", async () => {
    const res = await user1
      .delete("/pages/")
      .expect(404);
    expect(res.body.id);
  });
});
