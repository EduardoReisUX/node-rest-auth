/** @typedef {import("../repositories/IUsersRepository").IUsersRepository} IUsersRepository  */
/** @typedef {import("../entities/Users").User} User  */

import crypto from "node:crypto";
import { promisify } from "node:util";

export class UsersService {
  /** @param {IUsersRepository} UsersRepository*/
  constructor(UsersRepository) {
    this.usersRepository = UsersRepository;
  }

  /**
   *
   * @param {string} password
   * @returns {Promise<string>}
   */
  async #hashPassword(password) {
    const scryptAsync = promisify(crypto.scrypt);
    const salt = crypto.randomBytes(16).toString("hex");

    /** @type {Buffer} */
    const derivedKey = await scryptAsync(password, salt, 64);

    return salt + ":" + derivedKey.toString("hex");
  }

  /**
   *
   * @param {{ password: string, hashedPassword: string }} param
   * @returns {Promise<boolean>}
   */
  async #verifyPassword({ password, hashedPassword }) {
    const scryptAsync = promisify(crypto.scrypt);
    const [salt, hash] = hashedPassword.split(":");
    const keyBuffer = Buffer.from(hash, "hex");

    const derivedKey = await scryptAsync(password, salt, 64);

    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  }

  /** @param {User} user  */
  async create(user) {
    const { username, password } = user;

    if (!username.trim() || !password.trim()) {
      return { error: "invalid username or password!" };
    }

    const userAlreadyExists = await this.usersRepository.findByUsername(
      username
    );

    if (!!userAlreadyExists) {
      return { error: "user already exists!" };
    }

    const newUser = {
      ...user,
      password: await this.#hashPassword(password),
    };

    return await this.usersRepository.create(newUser);
  }

  async findAll() {
    const users = await this.usersRepository.getAll();

    if (!users) {
      return { error: "There is no user!" };
    }

    return users;
  }

  /**
   *
   * @param {string} user_id
   */
  async delete(user_id) {
    return await this.usersRepository.delete(user_id);
  }

  /** @param {Pick<User, "username" | "password">} param */
  async login({ username, password }) {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      return { error: "user not found!" };
    }

    const passwordOk = await this.#verifyPassword({
      password,
      hashedPassword: user.password,
    });

    if (!passwordOk) {
      return { error: "username or password are invalid!" };
    }

    return { message: `Welcome, ${username}!` };
  }
}
