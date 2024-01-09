import assert from "node:assert";
import { describe, it, before, after } from "node:test";

/** @typedef {{ id: string, username: string, password: string }} UserData */

const BASE_URL = "http://localhost:3000";

describe("/users", () => {
  /** @type {import("node:http").Server} */
  let _server;

  before(async () => {
    _server = (await import("./index.js")).app;
    await new Promise((resolve) => _server.once("listening", resolve));
  });

  after((done) => _server.close());

  it("should create a user given valid data", async () => {
    const data = {
      id: "123",
      username: "Eduardo",
      password: "123456",
    };

    const request = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    /** @type {UserData} */
    const result = await request.json();

    const [salt, hash] = result.password.split(":");

    assert.strictEqual(request.status, 201);
    assert.notDeepStrictEqual(result, data);
    assert.ok(salt);
    assert.ok(hash);
    assert.notStrictEqual(result.password, data.password);
  });

  it("should not create a user given username or password are empty", async () => {
    const data = {
      id: "123",
      username: "",
      password: "123456",
    };

    const request = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await request.json();

    assert.strictEqual(request.status, 400);
    assert.deepStrictEqual(result, {
      error: "invalid username or password!",
    });

    const data2 = {
      id: "123",
      username: "Eduardo",
      password: "",
    };

    const request2 = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      body: JSON.stringify(data2),
    });

    const result2 = await request2.json();

    assert.strictEqual(request2.status, 400);
    assert.deepStrictEqual(result2, {
      error: "invalid username or password!",
    });
  });

  it("should not create a user that already exists", async () => {
    const data = {
      id: "123",
      username: "Eduardo",
      password: "123456",
    };

    const request = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await request.json();

    assert.strictEqual(request.status, 400);
    assert.deepStrictEqual(result, {
      error: "user already exists!",
    });
  });

  it("should return a list of users", async () => {
    const request = await fetch(`${BASE_URL}/users`);
    const result = await request.json();

    assert.strictEqual(request.status, 200);
    assert.notDeepStrictEqual(result, [
      { id: "123", username: "Eduardo", password: "123456" },
    ]);
    assert.notDeepEqual(result[0].password, "123456");
  });

  it("should login given valid username and password", async () => {
    const data = {
      username: "Eduardo",
      password: "123456",
    };

    const request = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await request.json();

    assert.strictEqual(request.status, 200);
    assert.deepStrictEqual(result, { message: "Welcome, Eduardo!" });
  });

  it("should delete a user given valid id", async () => {
    const data = {
      id: "123",
    };

    const request = await fetch(`${BASE_URL}/users`, {
      method: "DELETE",
      body: JSON.stringify(data),
    });

    const users = await (await fetch(`${BASE_URL}/users`)).json();

    assert.strictEqual(request.status, 204);
    assert.deepStrictEqual(users, []);
  });
});
