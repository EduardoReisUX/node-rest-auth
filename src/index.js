import { createServer } from "node:http";
import { router } from "./routes/index.js";

/** @type {import("node:http").RequestListener} */
function handle(request, response) {
  return router(request, response);
}

export const app = createServer(handle).listen(3000, () =>
  console.log("listening at 3000")
);
