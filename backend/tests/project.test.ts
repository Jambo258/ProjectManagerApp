/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { agent } from "supertest";
import app from "../src/server.js";
import { it, describe, beforeAll, afterAll, expect } from "vitest";

let projectId: number;
let secondProjectId: number;
let managerId: number;
let viewerId: number;

const manager = agent(app);
const viewer = agent(app);
const dummyUser = agent(app);


beforeAll(async () => {
  await dummyUser
    .post("/users/register")
    .send({ email: "dummy@gmail.com", name: "dummy", password: "Salasana1!" });

  const resManager = await manager
    .post("/users/register")
    .send({ email: "pekka1231@gmail.com", name: "pekka1", password: "Salasana1!" });
  managerId = resManager.body.id;

  const resViewer = await viewer
    .post("/users/register")
    .send({ email: "viewer234970173123@gmail.com", name: "pekka1", password: "Salasana1!" });
  viewerId = resViewer.body.id;
});

afterAll(async () => {
  await manager.delete("/users/delete");
  await viewer.delete("/users/delete");
  await dummyUser.delete("/users/delete");
});

describe("Project endpoint tests", () => {

  it("Try to view project that doesn't exist", async () => {
    const res = await manager
      .get("/projects/123456789")
      .expect(404)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("Couldn't find project");
  });

  it("Try to add new project without name", async () => {
    const res = await manager
      .post("/projects")
      .send({ name: "" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Try to delete user projects with wrong id", async () => {
    const res = await manager
      .delete("/projects/123456789")
      .expect(404)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("Couldn't find project");
  });

  it("Add new project", async () => {
    const res = await manager
      .post("/projects")
      .send({ name: "project1" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body.name).toEqual("project1");
    projectId = res.body.id;
  });

  it("Add another project", async () => {
    const res = await manager
      .post("/projects")
      .send({ name: "project1" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body.name).toEqual("project1");
    secondProjectId = res.body.id;
  });

  it("Get project details", async () => {
    const res = await manager
      .get("/projects/" + projectId)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body.name).toEqual("project1");
  });

  it("Try to add user to project with wrong role", async () => {
    const res = await manager
      .post(`/projects/${projectId}/users/`)
      .send({ role: "somerole", email: "dummy@gmail.com" })
      .expect(400)
      .expect("Content-Type", /json/);

    expect(res.body.error).toBeDefined();
  });

  it("Add user to project as viewer", async () => {
    const res = await manager
      .post(`/projects/${projectId}/users/`)
      .send({ role: "viewer", email: "viewer234970173123@gmail.com" })
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body.userid).toBeDefined();
    expect(res.body.role).toEqual("viewer");
  });

  it("Try to add same user to project again", async () => {
    const res = await manager
      .post(`/projects/${projectId}/users/`)
      .send({ role: "viewer", email: "viewer234970173123@gmail.com" })
      .expect(400)
      .expect("Content-Type", /json/);

    expect(res.body.error).toEqual("User is already on this project");
  });

  it("Change user role in project", async () => {
    const res1 = await manager
      .put(`/projects/${projectId}/users/${viewerId}`)
      .send({ role: "editor" })
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res1.body.userid).toEqual(viewerId);
    expect(res1.body.role).toEqual("editor");

    const res2 = await manager
      .put(`/projects/${projectId}/users/${viewerId}`)
      .send({ role: "viewer" })
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res2.body.userid).toEqual(viewerId);
    expect(res2.body.role).toEqual("viewer");
  });

  it("Try to change user role in project as viewer", async () => {
    const res = await viewer
      .put(`/projects/${projectId}/users/${managerId}`)
      .send({ role: "editor" })
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("Manager role required");
  });

  it("Change user role without defining role", async () => {
    const res = await manager
      .put(`/projects/${projectId}/users/${viewerId}`)
      .send({})
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Change user role with nonsense", async () => {
    const res = await manager
      .put(`/projects/${projectId}/users/${viewerId}`)
      .send({ role: "supersuperadmin" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Change user role in nonexistent project", async () => {
    const res = await manager
      .put(`/projects/213333/users/${viewerId}`)
      .send({ role: "viewer" })
      .expect(404)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("Couldn't find project");
  });

  it("Change user role in nonexistent user", async () => {
    const res = await manager
      .put(`/projects/${projectId}/users/213333`)
      .send({ role: "viewer" })
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("User is not on the project");
  });

  it("Try to change user role with outsider", async () => {
    const res = await dummyUser
      .put(`/projects/${projectId}/users/${viewerId}`)
      .send({ role: "viewer" })
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Try to add user to project which doesn't exist", async () => {
    const res = await manager
      .post(`/projects/${12345}/users/`)
      .send({ role: "editor", email: "dummy@gmail.com" })
      .expect(401)
      .expect("Content-Type", /json/);

    expect(res.body.error).toEqual("You are not on this project");
  });

  it("Try to add user which doesn't exist to project", async () => {
    const res = await manager
      .post(`/projects/${projectId}/users/`)
      .send({ role: "viewer", email: "dummyNOTINPROJECT@gmail.com" })
      .expect(404)
      .expect("Content-Type", /json/);

    expect(res.body.error).toEqual("Couldn't find user with such email");
  });

  it("View user projects", async () => {
    const res = await manager
      .get("/projects")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body).toBeTruthy();
  });

  it("Update project name", async () => {
    const res = await manager
      .put(`/projects/${projectId}`)
      .send({ name: "new projectname" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body.name).toEqual("new projectname");
  });

  it("Update project name without being on project", async () => {
    const res = await dummyUser
      .put(`/projects/${projectId}`)
      .send({ name: "new projectname" })
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Update nonexistent  project", async () => {
    const res = await manager
      .put("/projects/12333")
      .send({ name: "new projectname" })
      .expect(404)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("Couldn't find project");
  });

  it("Update project without name parameter", async () => {
    const res = await manager
      .put(`/projects/${projectId}`)
      .send({ email: "Missing project name" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Try to delete project without correct role", async () => {
    const res = await viewer
      .delete(`/projects/${projectId}`)
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("Manager role required");
  });

  it("Try to update project name without correct role", async () => {
    const res = await viewer
      .put(`/projects/${projectId}`)
      .send({ name: "new projectname" })
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("Manager role required");
  });

  it("Try to view project details on project that user is not on", async () => {
    const res = await viewer
      .get(`/projects/${secondProjectId}`)
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("User is not on the project");
  });

  it("Try to add user as editor", async () => {
    const res = await viewer
      .post(`/projects/${projectId}/users/`)
      .send({ role: "viewer", email: "viewer234970173123@gmail.com" })
      .expect(401)
      .expect("content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Try to delete project as outsider", async () => {
    const res = await dummyUser
      .delete(`/projects/${projectId}`)
      .expect(401)
      .expect("content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Try to delete user as outsider", async () => {
    const res = await dummyUser
      .delete(`/projects/${projectId}/users/${viewerId}`)
      .expect(401)
      .expect("content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Try to delete user as viewer", async () => {
    const res = await viewer
      .delete(`/projects/${projectId}/users/${managerId}`)
      .expect(401)
      .expect("content-Type", /json/);
    expect(res.body.error).toEqual("Manager role required");
  });

  it("Leave project as a viewer", async () => {
    const res = await viewer
      .delete(`/projects/${projectId}/users/${viewerId}`)
      .expect(200)
      .expect("content-Type", /json/);
    expect(res.body.userid).toEqual(viewerId);
  });

  it("Try to remove non-existent user from project", async () => {
    const res = await manager
      .delete(`/projects/${projectId}/users/3213211`)
      .expect(400)
      .expect("content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Try to remove user from non-existent  project", async () => {
    const res = await manager
      .delete("/projects/3213211/users/3213211")
      .expect(404)
      .expect("content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Try to add user without role", async () => {
    const res = await manager
      .post(`/projects/${projectId}/users/`)
      .send({ email: "viewer234970173123@gmail.com" })
      .expect(400)
      .expect("content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Leave projects as last user", async () => {
    await manager
      .delete(`/projects/${projectId}/users/${managerId}`)
      .expect(200)
      .expect("Content-Type", /json/);

    await manager
      .get(`/projects/${projectId}`)
      .expect(404)
      .expect("Content-Type", /json/);
  });

  it("Delete project", async () => {
    const res = await manager
      .delete(`/projects/${secondProjectId}`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body.id).toEqual(secondProjectId);
  });

  it("get INT32_MAX + 1", async () => {
    await manager
      .get("/projects/" + (2147483647 + 1))
      .expect(500);
  });

  it("put INT32_MAX + 1", async () => {
    await manager
      .put("/projects/" + (2147483647 + 1))
      .send({ name: "pagetestupdate" })
      .expect(500);
  });

  it("delete INT32_MAX + 1", async () => {
    await manager
      .delete("/projects/" + (2147483647 + 1))
      .expect(500);
  });

  it("post user INT32_MAX + 1", async () => {
    await manager
      .post("/projects/2147483648/users/")
      .send({ role: "editor", email: "dummy@gmail.com" })
      .expect(500);
  });

  it("put user INT32_MAX + 1", async () => {
    await manager
      .put(`/projects/2147483648/users/${managerId}`)
      .send({ role: "editor" })
      .expect(500);
  });

  it("delete user INT32_MAX + 1", async () => {
    await manager
      .delete(`/projects/2147483648/users/${managerId}`)
      .expect(500);
  });

});
