# User Authentication with Node.js

## Technologies

- Node@20.9.0

## How to run

- `npm run dev`: runs the server,
- `npm run test`: runs the server AND tests,
- `npm run test:dev`: runs the server AND tests in watch mode.

## Few things I learned

### password hashing and salting

TODO

### http response status code

- 400 Bad Request: The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
- 401 Unauthorized: The client doesn't have access a information, it must authenticate itself to get the requested response.

### ts-check all files (even if it's javascript)

Create `jsconfig.json` file to enable ts type checking. Since vanilla javascript lacks supports to type checking, this is super useful since it enable to rapidly see errors and handle them.

## Errors I found

### TypeError: Body is unusable

Happens when trying to await the same request twice.

```javascript
console.log(await request.text()); // X only this is logged
console.log(await request.json()); // --> throws error
```

To fix it, only await the request once:

```javascript
console.log(await request.json());
```

Or you can [`clone()`](https://developer.mozilla.org/en-US/docs/Web/API/Request/clone) the request:

```javascript
const request = new Request("flowers.jpg");
const newRequest = request.clone(); // a copy of the request is now stored in newRequest
```

## Fonts

- [Build Node.js User Authentication - Password Login](https://www.youtube.com/watch?v=Ud5xKCYQTjM)
- [JWT Authentication Tutorial - Node.js](https://www.youtube.com/watch?v=mbsmsi7l3r4)
- [Hash your passwords with scrypt using Nodejs crypto module](https://dev.to/farnabaz/hash-your-passwords-with-scrypt-using-nodejs-crypto-module-316k)
- [JS Projects Utilizing TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html)
- [What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [How to enable ts-check in es6](https://stackoverflow.com/questions/53157373/how-to-enable-ts-check-in-es6)
