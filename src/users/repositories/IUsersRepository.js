/** @typedef {import("../entities/Users").User} User */

/**
 * @typedef {{
 *  getAll: () => Promise<User[]>;
 *  findById: (user_id: User["id"]) => Promise<User | null>;
 *  findByUsername: (username: User["username"]) => Promise<User | null>;
 *  create: (user: User) => Promise<User>;
 *  delete: (user_id: User["id"]) => Promise<void>;
 * }} IUsersRepository
 * */

export {};
