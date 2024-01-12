import { userRoutes } from "./users/index.routes.js";
import { userLoginRoute } from "./users/login.routes.js";

const routes = {
  "/users": userRoutes,
  "/users/login": userLoginRoute,
};

/** @type {import("node:http").RequestListener} */
export function router(request, response) {
  if (request.url) {
    const route = routes[request.url];
    return route(request, response);
  }

  response.writeHead(404);
  response.end();
}
