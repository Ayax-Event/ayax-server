import { z } from "zod";
import User from "../../../../../db/models/User";

export async function POST(request) {
  try {
    // console.log(response, "response register model");
    const userId = request.headers.get("x-user-id");
    console.log(userId, "userId api addAdmin");
    if (!userId) {
      return Response.json({ message: "Unathorized" }, { status: 401 });
    }

    const findAdmin = await User.findUserById(userId);
    console.log(findAdmin, "aaaadmin");

    if (findAdmin.role !== "admin") {
      return Response.json({ message: "Unathorized" }, { status: 401 });
    }
    const { name, username, email, password } = await request.json();
    const profilepict =
      "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
    const res = await User.create({
      name,
      username,
      email,
      password,
      role: "admin",
      profilepict,
      location: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // console.log(res, "<<<<<<<<<<<<<<res register");
    return Response.json({
      message: `Success registered with username: ${username}`,
    });
  } catch (error) {
    console.log(error, "<<<<< error");
    let message = error.message || "Internal server error";
    let status = error.status || 500;
    if (error instanceof z.ZodError) {
      console.log(error.errors[0], "<<<<<<<<<< error zod");
      message = error.errors[0].message;
      status = 400;
    }
    return Response.json({ message }, { status });
  }
}
