
import database from "../confiq/mongodb";
import { z } from "zod";
import { hashPassword } from "@/helpers/bcrypt";
import { ObjectId } from "mongodb";

const UserSchema = z.object({
  name: z.string().min(3),
  username: z.string().min(3),
  email: z.string().email().min(10),
  password: z.string().min(8),
  profilepict: z.string().optional(),
  location: z.string().optional(),
  role: z.string(),
  createdAt: z.date().min(new Date()),
  updatedAt: z.date().min(new Date())
});
export default class User {
  static collection() {
    return database.collection("users");
  }
  static async create(user) {
    try {
      UserSchema.parse(user);
      user.password = hashPassword(user.password);

      const uniqueUser = await this.collection().findOne({
        $or: [{ email: user.email }, { username: user.username }],
      });
      if (uniqueUser) {
        throw { message: "Email/Username has been used", status: 400 };
      }
      return await this.collection().insertOne(user);
    } catch (error) {
      console.log(error,"<<<<<<<<<<<<< error register");
      
    }

  }
  static async findByEmail(email) {
    return await this.collection().findOne({ email });
  }
  static async findByEmail(email) {
    return await this.collection().findOne({ email });
  }
  static async findById(_id) {
    return await this.collection().findOne({ _id: new ObjectId(_id) });
  }
}
