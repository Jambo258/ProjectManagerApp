import request from "supertest";
import server from "../src/server.js";
import { it, describe, beforeAll, afterAll, beforeEach } from "vitest";

beforeAll(async () => {
  await request(server)
    .post("/user/register")
    .send({ email: "pekka", password: "salainen" });
});

beforeEach(async () => {
  await request(server).post("/projects/").send({ name: "testproject" });
});

afterAll(async () => {
  await request(server).delete("/user/");
});

describe("server", () => {
  it("get all pages", async () => {
    await request(server)
      .get("/pages/")
      .send({})
      .expect(200)
      .expect("content-type", /json/);
  });
});

describe("server", () => {
  it("create new page", async () => {
    await request(server)
      .post("/pages/")
      .send({ name: "testpage", projectid: 3 })
      .expect(200)
      .expect("content-type", /json/);
  });
});

describe("server", () => {
  it("get page by id", async () => {
    await request(server)
      .get("/pages/10")
      .send({})
      .expect(200)
      .expect("content-type", /json/);
  });
});
