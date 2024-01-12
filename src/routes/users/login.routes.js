import { users } from "../../users/entities/Users.js";
import { UsersService } from "../../users/services/UsersService.js";
import { UserRepository } from "../../users/repositories/UsersRepository.js";
import { once } from "node:events";

/** @type {import("node:http").RequestListener} */
export async function userLoginRoute(request, response) {
  const usersRepository = new UserRepository(users);
  const usersService = new UsersService(usersRepository);

  if (request.method === "POST") {
    const { username, password } = JSON.parse(`${await once(request, "data")}`);

    const result = await usersService.login({ username, password });

    if ("error" in result) {
      response.writeHead(400);
      response.end(JSON.stringify(result));
      return;
    }

    response.writeHead(200);
    response.end(JSON.stringify(result));
    return;
  }

  response.writeHead(404);
  response.end();
}
