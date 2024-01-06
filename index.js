"use strict";

import { createServer } from "node:http";
import { once } from "node:events";

/** @type {Array<{ id: string, name: string, password: string }>} */
const users = [];

/** @type {import("node:http").RequestListener} */
function getUsers(request, response) {
  response.writeHead(200);
  response.end(JSON.stringify(users));
}

/** @type {import("node:http").RequestListener} */
async function createUser(request, response) {
  const { id, username, password } = JSON.parse(await once(request, "data"));

  const user = {
    id: id,
    username: username,
    password: password,
  };

  users.push(user);

  response.writeHead(201);
  response.end(JSON.stringify(user));
}

/** @type {import("node:http").RequestListener} */
async function deleteUser(request, response) {
  const { id } = JSON.parse(await once(request, "data"));
  const userIndex = users.findIndex((user) => user.id === id);

  users.splice(userIndex, 1);

  response.writeHead(204);
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

  response.end(JSON.stringify(users));
}

export const app = createServer(controller).listen(3000, () =>
  console.log("listening at 3000")
);
