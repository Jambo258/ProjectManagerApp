import {agent} from "supertest";
import server from "../src/server.js";
import { it, describe, beforeAll, afterAll, expect } from "vitest";


const request = agent(server);

beforeAll(async () => {
  await request
    .post("/user/register")
    .send({ email: "pekka@mail.com", name: "pekka", password: "salainen" });
  await request.post("/projects/").send({ name: "testproject" });
});


afterAll(async () => {
  await request
    .post("/user/login")
    .send({ email: "pekka@mail.com", password: "salainen" });
  await request
    .delete("/user/delete");
});

describe("server", () => {
  it("create new page", async () => {
    await request
      .post("/pages/")
      .send({ name: "testpage", projectid: 1 })
      .expect(200)
      .expect("content-type", /json/);
  });

  it("try to create page with missing name", async () => {
    const res = await request
      .post("/pages/")
      .send({projectid: 1 })
      .expect(400)
      .expect("content-type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("try to create page with missing projectid", async () => {
    const res = await request
      .post("/pages/")
      .send({name: "pagetest" })
      .expect(400)
      .expect("content-type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("get page by id", async () => {
    const res = await request
      .get("/pages/37")
      .expect(200)
      .expect("content-type", /json/);
    expect(res.body).toBeDefined();
  });

  it("get page by wrong id", async () => {
    const res = await request
      .get("/pages/10")
      .expect(404)
      .expect("content-type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("try to get page with no id", async () => {
    const res = await request
      .get("/pages/")
      .expect(404)
      .expect("content-type", /json/);
    expect(res.body.error).toBeDefined();
  });


});

