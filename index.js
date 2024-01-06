"use strict";

import { createServer } from "node:http";

/** @type {import("node:http").RequestListener} */
function controller(request, response) {
  response.end(JSON.stringify({ message: "Hello, world!" }));
}

export const app = createServer(controller).listen(3000, () =>
  console.log("listening at 3000")
);
