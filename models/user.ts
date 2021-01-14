import * as db from "../config/db";

export default class User extends db._bookshelf.Model<User> {
  get tableName() {
    return "users";
  }
  get hasTimestamps() {
    return true;
  }
}
