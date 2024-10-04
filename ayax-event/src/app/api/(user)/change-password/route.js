import User, { PasswordSchema } from "../../../../../db/models/User";
import { comparePassword, hashPassword } from "@/helpers/bcrypt";

export const POST = async (request) => {
  try {
    const userId = request.headers.get("x-user-id");
    const { oldPassword, newPassword } = await request.json();
    console.log(oldPassword, newPassword, "passssssssss coy");

    if (!oldPassword || !newPassword) {
      return Response.json(
        {
          message: "Old password and new password are required",
        },
        { status: 400 }
      );
    }

    const findUser = await User.findUserById(userId);
    console.log(findUser.password, "finduser passsss");

    if (!findUser) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const isOldPasswordValid = comparePassword(oldPassword, findUser.password);
    console.log(isOldPasswordValid, "pass laaaaammmmmaaaa");

    if (!isOldPasswordValid) {
      return Response.json(
        {
          message: "Current password is incorrect",
        },
        { status: 400 }
      );
    }

    PasswordSchema.parse(newPassword);
    const hashedNewPassword = hashPassword(newPassword);
    console.log(hashedNewPassword, "<<<<<<<<<< hashpass");

    await User.update(userId, hashedNewPassword);

    return Response.json(
      {
        message: "Password successfully updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password change error:", error);
    return Response.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
