/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from "supertest";
import app from "../src/server.js";
import { it, describe, beforeAll, afterAll, expect } from "vitest";

const req = request.agent(app);
let projectId: number;
let secondProjectId: number;
let dummyUserId: number;

beforeAll(async () => {
  const resDummyUser = await req
    .post("/users/register")
    .send({ email: "dummy@gmail.com", name: "dummy", password: "salainen" });

  dummyUserId = resDummyUser.body.id;

  await req
    .post("/users/register")
    .send({ email: "pekka1@gmail.com", name: "pekka1", password: "salainen" });
});

afterAll(async () => {
  await req
    .post("/users/login")
    .send({ email: "pekka1@gmail.com", password: "salainen" })
    .expect(200)
    .expect("Content-Type", /json/);

  await req.delete("/users/delete");
});

describe("Project endpoint tests", () => {

  it("Try to view project that doesnt exist", async () => {
    const res = await req
      .get("/projects/123456789")
      .expect(404)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("Couldnt find project");
  });

  it("Try to add new project without name", async () => {
    const res = await req
      .post("/projects")
      .send({ name: "" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("Missing project name");
  });

  it("Try to delete user projects with wrong id", async () => {
    const res = await req
      .delete("/projects/123456789")
      .expect(404)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("Couldnt find project");
  });

  it("Add new project", async () => {
    const res = await req
      .post("/projects")
      .send({ name: "project1" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body.name).toEqual("project1");
    projectId = res.body.id;
  });

  it("Add another project", async () => {
    const res = await req
      .post("/projects")
      .send({ name: "project1" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body.name).toEqual("project1");
    secondProjectId = res.body.id;
  });

  it("Try to add user to project with wrong role", async () => {
    const res = await req
      .post(`/projects/${projectId}/users/${dummyUserId}`)
      .send({ role: "somerole" })
      .expect(400)
      .expect("Content-Type", /json/);

    expect(res.body.error).toEqual("Wrong role");
  });

  it("Add user to project as viewer", async () => {
    const res = await req
      .post(`/projects/${projectId}/users/${dummyUserId}`)
      .send({ role: "viewer" })
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body.userid).toBeDefined();
    expect(res.body.role).toEqual("viewer");
  });

  it("Try to add same user to project again", async () => {
    const res = await req
      .post(`/projects/${projectId}/users/${dummyUserId}`)
      .send({ role: "viewer" })
      .expect(400)
      .expect("Content-Type", /json/);

    expect(res.body.error).toEqual("User is already on this project");
  });

  it("Try to add user to project which doesnt exist", async () => {
    const res = await req
      .post(`/projects/${12345}/users/${dummyUserId}`)
      .send({ role: "editor" })
      .expect(401)
      .expect("Content-Type", /json/);

    expect(res.body.error).toEqual("Session holder is not on this project");
  });

  it("Try to add user which doesnt exist to project", async () => {
    const res = await req
      .post(`/projects/${projectId}/users/${123456789}`)
      .send({ role: "viewer" })
      .expect(404)
      .expect("Content-Type", /json/);

    expect(res.body.error).toEqual("Couldnt find user");
  });

  it("View user projects", async () => {
    const res = await req
      .get("/projects")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body).toBeTruthy();
  });

  it("Logins dummy user", async () => {
    await req
      .post("/users/login")
      .send({ email: "dummy@gmail.com", password: "salainen" })
      .expect(200)
      .expect("Content-Type", /json/);
  });

  it("Try to delete project without correct role", async () => {
    const res = await req
      .delete(`/projects/${projectId}`)
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("Manager role required");
  });

  it("Try to update project name without correct role", async () => {
    const res = await req
      .put(`/projects/${projectId}`)
      .send({ name: "new projectname" })
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("Manager role required");
  });

  it("Try to view project details on project that user is not on", async () => {
    const res = await req
      .get(`/projects/${secondProjectId}`)
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("User is not on the project");
  });

  it("Leave project as a viewer", async () => {
    console.log("test");
    const res = await req
      .delete(`/projects/${projectId}/users/${dummyUserId}`)
      .expect(200)
      .expect("content-Type", /json/);
    expect(res.body.userid).toEqual(dummyUserId);
    console.log(res.body);
  });

  it("Login as project creator and delete user from project and delete projects", async () => {
    await req
      .post("/users/login")
      .send({ email: "pekka1@gmail.com", password: "salainen" })
      .expect(200)
      .expect("Content-Type", /json/);

    // const resAfterDeleteUser = await req
    //   .delete(`/projects/${projectId}/users/${dummyUserId}`)
    //   .expect(200)
    //   .expect("Content-Type", /json/);

    // expect(resAfterDeleteUser.body.userid).toEqual(dummyUserId);

    const resAfterDeleteProject = await req
      .delete(`/projects/${projectId}`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(resAfterDeleteProject.body.id).toEqual(projectId);

    const resAfterSecondProjectDelete = await req
      .delete(`/projects/${secondProjectId}`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(resAfterSecondProjectDelete.body.id).toEqual(secondProjectId);
  });

  it("Logins dummy user", async () => {
    await req
      .post("/users/login")
      .send({ email: "dummy@gmail.com", password: "salainen" })
      .expect(200)
      .expect("Content-Type", /json/);
  });

  it("Delete dummy user", async () => {
    await req.delete("/users/delete");
  });
});
