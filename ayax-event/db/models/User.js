import database from "../confiq/mongodb";
import { z } from "zod";
import { hashPassword } from "@/helpers/bcrypt";
import { ObjectId } from "mongodb";

export const PasswordSchema = z.string().min(8)

export const UserSchema = z.object({
  name: z.string().min(3),
  username: z.string().min(3),
  email: z.string().email().min(10),
  password: z.string().min(8),
  profilepict: z.string().optional(),
  location: z.union([z.string(), z.null()]).default(null),
  role: z.string(),
  createdAt: z.date().min(new Date()),
  updatedAt: z.date().min(new Date()),
});
export default class User {
  static collection() {
    return database.collection("users");
  }

  static async create(user) {
    UserSchema.parse(user);
    user.password = hashPassword(user.password);

    const uniqueUser = await this.collection().findOne({
      $or: [{ email: user.email }, { username: user.username }],
    });
    if (uniqueUser) {
      throw { message: "Email/Username has been used", status: 400 };
    }
    return await this.collection().insertOne(user);
  }

  static async findByEmail(email) {

    return await this.collection().findOne({ email });
  }

  static async findByEmail(email) {
    return await this.collection().findOne({ email });
  }

  static async findById(_id) {
    try {
      const result = await this.collection()
        .aggregate([
          {
            $match: {
              _id: new ObjectId(String(_id)),
            },
          },
          {
            $project: {
              password: 0,
            },
          },
        ])
        .toArray();

      return result[0];
    } catch (error) {
      console.error("Error in findById:", error);
      throw error;
    }
  }

  static async updateProfileLocation(_id, profilePic, location) {
    return this.collection().updateOne();
  }
  static async update(userId, newPassword) {
    try {
      console.log("MASUK BOOSSSSSQUEEE");

      console.log(userId, "<<<<<<<<<<< userId model");
      console.log(newPassword, "<<<<<<<<<<<< model pass");

      // Use `$set` operator to update the password
      return await this.collection().updateOne(
        { _id: new ObjectId(String(userId)) }, // Assuming the userId is the _id in MongoDB
        {
          $set: { password: newPassword }     // Correct way to set the password
        }
      );
    } catch (error) {
      console.log(error, "<<<<<<<<<<<<<<<<<<< error at change pass");
    }
  }

  static async findUserById(userId) {
    try {
      return this.collection().findOne({
        _id: new ObjectId(String(userId))
      })
    } catch (error) {
      console.log(error);

    }

  }
}
