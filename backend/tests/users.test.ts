/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { agent } from "supertest";
import { it, describe, beforeAll, afterAll, expect } from "vitest";
import app from "../src/server.js";

const request = agent(app);

let testUserID = 0;

beforeAll(async () => {
  const res = await request
    .post("/users/register")
    .send({ email: "pekka@mail.com", name: "pekka", password: "Salasana1!" });

  testUserID = res.body.id;
});

afterAll(async () => {
  await request
    .post("/users/login")
    .send({ email: "pekka@mail.com", password: "Salasana1!" });
  await request
    .delete("/users/delete");
});

describe("Server", () => {
  it("Register with valid data", async () => {
    await request
      .post("/users/register")
      .send({ email: "pekka223@mail.com", name: "pekka", password: "Salasana1!" })
      .expect(200)
      .expect("Content-Type", /json/);
    await request
      .delete("/users/delete");
  });

  it("Register with same email", async () => {
    await request
      .post("/users/register")
      .send({ email: "pekka@mail.com", name: "pekka", password: "Salasana1!" })
      .expect(409)
      .expect("Content-Type", /json/);
  });

  it("Register with invalid email", async () => {
    const res = await request
      .post("/users/register")
      .send({ email: "pekka", name: "pekka", password: "Salasana1!" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Register with invalid email 2", async () => {
    const res = await request
      .post("/users/register")
      .send({ email: "pekka@a.", name: "pekka", password: "Salasana1!" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Register without email", async () => {
    const res = await request
      .post("/users/register")
      .send({ name: "pekka", password: "Salasana1!" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Register without name", async () => {
    const res = await request
      .post("/users/register")
      .send({ email: "pekka@mail.com", password: "Salasana1!" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Register without password", async () => {
    const res = await request
      .post("/users/register")
      .send({ email: "pekka@mail.com", name: "pekka" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Register without data", async () => {
    const res = await request
      .post("/users/register")
      .send({})
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Register with GET", async () => {
    const res = await request
      .get("/users/register")
      .send({})
      .expect(404)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Login with GET", async () => {
    const res = await request
      .get("/users/register")
      .send({})
      .expect(404)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Login with valid data", async () => {
    const res = await request
      .post("/users/login")
      .send({ email: "pekka@mail.com", password: "Salasana1!" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body.email).toBe("pekka@mail.com");
  });

  it("Login twice", async () => {
    const res = await request
      .post("/users/login")
      .send({ email: "pekka@mail.com", password: "Salasana1!" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body.email).toBe("pekka@mail.com");
    const res2 = await request
      .post("/users/login")
      .send({ email: "pekka@mail.com", password: "Salasana1!" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res2.body.email).toBe("pekka@mail.com");
  });

  it("Login with wrong password", async () => {
    const res = await request
      .post("/users/login")
      .send({ email: "pekka@mail.com", password: "EiOleSalasana1!" })
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Login with wrong email", async () => {
    const res = await request
      .post("/users/login")
      .send({ email: "pekka@wrong.com", password: "EiOleSalasana1!" })
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Login with invalid email", async () => {
    const res = await request
      .post("/users/login")
      .send({ email: "EiOlemassa@mail.com", password: "Salaasana1!" })
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Login without email", async () => {
    const res = await request
      .post("/users/login")
      .send({ password: "Salasana1!" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Login without existing user", async () => {
    const res = await request
      .post("/users/login")
      .send({ email: "matti@mail.com", password: "Salasana1!" })
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("get user id by email", async () => {
    const res = await request
      .post("/users/getuserbyemail")
      .send({ email: "pekka@mail.com" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body.id).toEqual(testUserID);
  });

  it("get user id by wrong email", async () => {
    const res = await request
      .post("/users/getuserbyemail")
      .send({ email: "pekka@wrongmail.com" })
      .expect(404)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual("Couldn't find user");
  });

  it("get user id with no email", async () => {
    const res = await request
      .post("/users/getuserbyemail")
      .send({})
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Logout", async () => {
    const res = await request
      .get("/users/logout")
      .expect(204);
    expect(res.body.email).toBeUndefined();
  });

  it("Logout and delete", async () => {
    await request
      .get("/users/logout")
      .expect(204);
    const res = await request
      .delete("/users/delete")
      .expect(401)
      .expect("Content-Type", /json/);
    expect(res.body.email).toBeUndefined();
    expect(res.body.name).toBeUndefined();
    expect(res.body.id).toBeUndefined();
  });

  it("register and delete user", async () => {
    const resRegister = await request
      .post("/users/register")
      .send({ email: "pekka2@mail.com", name: "pekka", password: "Salasana1!" })
      .expect(200)
      .expect("Content-Type", /json/);
    const resDelete = await request
      .delete("/users/delete")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(resDelete.body.email).toBe("pekka2@mail.com");
    expect(resDelete.body.name).toBe("pekka");
    expect(resDelete.body.id).toBe(resRegister.body.id);
  });

  it("Update password", async () => {
    await request
      .post("/users/login")
      .send({ email: "pekka@mail.com", password: "Salasana1!" });
    const res = await request
      .put("/users/update")
      .send({ password: "Salasana1!" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body.email).toBeDefined();
  });

  it("Update name", async () => {
    await request
      .post("/users/login")
      .send({ email: "pekka@mail.com", password: "Salasana1!" });
    const res = await request
      .put("/users/update")
      .send({ name: "Pekka" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body.name).toBe("Pekka");
  });

  it("Update with invalid email", async () => {
    await request
      .post("/users/login")
      .send({ email: "pekka@mail.com", password: "Salasana1!" });
    const res = await request
      .put("/users/update")
      .send({ email: "Salasana1!" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Update email", async () => {
    await request
      .post("/users/login")
      .send({ email: "pekka@mail.com", password: "Salasana1!" });
    const res = await request
      .put("/users/update")
      .send({ email: "pekka300@mail.com" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body.email).toBe("pekka300@mail.com");
    const res2 = await request
      .put("/users/update")
      .send({ email: "pekka@mail.com" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res2.body.email).toBe("pekka@mail.com");
  });

  it("Update without data", async () => {
    await request
      .post("/users/login")
      .send({ email: "pekka@mail.com", password: "Salasana1!" });
    const res = await request
      .put("/users/update")
      .send()
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Update empty name", async () => {
    await request
      .post("/users/login")
      .send({ email: "pekka@mail.com", password: "Salasana1!" });
    const res = await request
      .put("/users/update")
      .send({ name: "" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Update empty password", async () => {
    await request
      .post("/users/login")
      .send({ email: "pekka@mail.com", password: "Salasana1!" });
    const res = await request
      .put("/users/update")
      .send({ password: "" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Update empty email", async () => {
    await request
      .post("/users/login")
      .send({ email: "pekka@mail.com", password: "Salasana1!" });
    const res = await request
      .put("/users/update")
      .send({ email: "" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("Update email with conflict", async () => {
    await request
      .post("/users/register")
      .send({ email: "pekka2222@mail.com", name: "pekka", password: "Salasana1!" })
      .expect(200)
      .expect("Content-Type", /json/);
    await request
      .put("/users/update")
      .send({ email: "pekka@mail.com", name: "pekka", password: "Salasana1!" })
      .expect(409)
      .expect("Content-Type", /json/);
    await request
      .delete("/users/delete");
  });
});
