import database from "../confiq/mongodb";

export default class Category {
  static collection() {
    return database.collection("categories");
  }

  static async getAll() {
    return await this.collection().find().toArray();
  }
}
