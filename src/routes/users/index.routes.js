import { UserRepository } from "../../users/repositories/UsersRepository.js";
import { UsersService } from "../../users/services/UsersService.js";
import { users } from "../../users/entities/Users.js";
import { once } from "node:events";

/** @type {import("node:http").RequestListener} */
export async function userRoutes(request, response) {
  const usersRepository = new UserRepository(users);
  const usersService = new UsersService(usersRepository);

  if (request.method === "POST") {
    const { id, username, password } = JSON.parse(
      `${await once(request, "data")}`
    );
    const user = await usersService.create({ id, password, username });

    if ("error" in user) {
      response.writeHead(400);
      response.end(JSON.stringify({ error: user.error }));
      return;
    }

    response.writeHead(201, { "Content-type": "Application/json" });
    response.end(JSON.stringify(user));
    return;
  }

  if (request.method === "DELETE") {
    const { id } = JSON.parse(`${await once(request, "data")}`);

    await usersService.delete(id);

    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === "GET") {
    const users = await usersService.findAll();

    if ("error" in users) {
      response.writeHead(400);
      response.end(JSON.stringify({ error: users.error }));
      return;
    }

    response.writeHead(200);
    response.end(JSON.stringify(users));
  }
}
