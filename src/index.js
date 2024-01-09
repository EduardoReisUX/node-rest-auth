"use strict";

import { createServer } from "node:http";
import { once } from "node:events";
import crypto from "node:crypto";

/** @type {Array<{ id: string, username: string, password: string }>} */
const users = [];

/** @type {import("node:http").RequestListener} */
function getUsers(request, response) {
  response.writeHead(200);
  response.end(JSON.stringify(users));
}

/**
 *
 * @param {string} password
 * @returns {Promise<string>}
 */
async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);

      const key = derivedKey.toString("hex");

      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}

/**
 *
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
async function verifyPassword(password, hashedPassword) {
  return new Promise((resolve, reject) => {
    const [salt, hash] = hashedPassword.split(":");
    const keyBuffer = Buffer.from(hash, "hex");

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(crypto.timingSafeEqual(keyBuffer, derivedKey));
    });
  });
}

/** @type {import("node:http").RequestListener} */
async function loginUser(request, response) {
  const { username, password } = JSON.parse(`${await once(request, "data")}`);
  const user = users.find((user) => user.username === username);

  if (!user) {
    response.writeHead(404);
    response.end(JSON.stringify({ error: "user not found!" }));
    return;
  }

  const passwordOk = await verifyPassword(password, user.password);

  if (!passwordOk) {
    response.writeHead(400);
    response.end(
      JSON.stringify({ error: "username or password are invalid!" })
    );
    return;
  }

  response.end(JSON.stringify({ message: `Welcome, ${username}!` }));
}

/** @type {import("node:http").RequestListener} */
async function createUser(request, response) {
  /** @type {{id: string, username: string, password: string}} */
  const { id, username, password } = JSON.parse(
    `${await once(request, "data")}`
  );

  if (!username.trim() || !password.trim()) {
    response.writeHead(400);
    response.end(JSON.stringify({ error: "invalid username or password!" }));
    return;
  }

  const userAlreadyExists = !!users.find((user) => user.username === username);

  if (userAlreadyExists) {
    response.writeHead(400);
    response.end(JSON.stringify({ error: "user already exists!" }));
    return;
  }

  const user = {
    id: id,
    username: username,
    password: await hashPassword(password),
  };

  users.push(user);

  response.writeHead(201);
  response.end(JSON.stringify(user));
}

/** @type {import("node:http").RequestListener} */
async function deleteUser(request, response) {
  const { id } = JSON.parse(`${await once(request, "data")}`);
  const userIndex = users.findIndex((user) => user.id === id);

  users.splice(userIndex, 1);

  response.writeHead(204);
  response.end();
}

/** @type {import("node:http").RequestListener} */
function controller(request, response) {
  if (request.method === "GET" && request.url === "/users") {
    return getUsers(request, response);
  }

  if (request.method === "POST" && request.url === "/users") {
    return createUser(request, response);
  }

  if (request.method === "DELETE" && request.url === "/users") {
    return deleteUser(request, response);
  }

  if (request.method === "POST" && request.url === "/users/login") {
    return loginUser(request, response);
  }

  response.end(JSON.stringify(users));
}

export const app = createServer(controller).listen(3000, () =>
  console.log("listening at 3000")
);
