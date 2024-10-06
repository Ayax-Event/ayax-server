import { z } from "zod";
import User from "../../../../../db/models/User";
import jwt from "jsonwebtoken";
import * as jose from "jose";
import bcryptjs from "bcryptjs";

export const comparePassword = (password, hashedPassword) => {
  return bcryptjs.compareSync(password, hashedPassword);
};
const secretKey = process.env.JWT_SECRET;
console.log(secretKey, "<<<<<<<<<<<<<<<<<<secret key");

export const signToken = (payload) => {
  return jwt.sign(payload, secretKey);
};
import { cookies } from "next/headers";

export async function POST(response) {
  try {
    console.log("masusk");
    const { email, password } = await response.json();
    console.log(email, password, "<<<<<<<<<<<<<<<<<<<<<<<<<pass");

    const user = await User.findByEmail(email);
    console.log(user, "<<<<<<<<< user login");

    if (!user) throw { message: "Invalid Email/Password", status: 401 };

    const validPassword = comparePassword(password, user.password);
    if (!validPassword)
      throw { message: "Invalid Email/Password", status: 401 };
    const payload = {
      _id: user._id.toString(),
    };
    // console.log(payload, "<<<<<<<<<<<<< payload login");

    const accessToken = signToken(payload);
    console.log(accessToken, "access token");

    const cookie = cookies().set("Authorization", `Bearer ${accessToken}`);
    // const token = localStorage.setItem("access_token", accessToken)
    // console.log(token, "<<<<<<<< cookies login server");

    return Response.json({ accessToken });
  } catch (error) {
    console.log(error, "<<<<< error");

    let message = error.message || "Internal server error";
    let status = error.status || 500;
    if (error instanceof z.ZodError) {
      console.log(error.errors[0], "<<<<<<<<<< error zod");

      message = error.errors[0].message;
      status = 401;
    }
    return Response.json({ message }, { status });
  }
}
