/** @typedef {import("./IUsersRepository").IUsersRepository} IUsersRepository */
/** @typedef {import("../entities/Users").User} User */

/** @implements {IUsersRepository} */
export class UserRepository {
  /** @type {User[]} */
  users;

  /** @param {User[]} users  */
  constructor(users) {
    this.users = users;
  }

  async getAll() {
    return this.users;
  }

  /** @param {string} user_id  */
  async findById(user_id) {
    return this.users.find((user) => user.id === user_id) || null;
  }

  /** @param {string} username  */
  async findByUsername(username) {
    return this.users.find((user) => user.username === username) || null;
  }

  /** @param {User} user  */
  async create(user) {
    this.users.push(user);
    return user;
  }

  /** @param {string} user_id  */
  async delete(user_id) {
    const userIndex = this.users.findIndex((user) => user.id === user_id);
    this.users.splice(userIndex, 1);
  }
}

// /**
//  *
//  * @param {User[]} users
//  */
// export function UserRepository(users) {
//   /** @type {IUsersRepository} */
//   function getUsers(username = "") {
//     if (username) {
//       return users.filter((user) => user.username === username);
//     }

//     return username;
//   }

//   /**
//    *
//    * @param {User} user
//    */
//   function createUser(user) {
//     users.push(user);
//   }

//   /**
//    *
//    * @param {User["id"]} userId
//    */
//   function deleteUser(userId) {
//     const userIndex = users.findIndex((user) => user.id === userId);

//     users.splice(userIndex, 1);
//   }

//   return { getUsers, createUser, deleteUser };
// }
