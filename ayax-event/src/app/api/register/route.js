import { z } from "zod";
import User from "../../../../db/models/User";

export async function POST(response) {
    try {
        console.log(response, "response register model");

        const { name, username, email, password } = await response.json();
        const role = "user"
        const profilepict = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
        const res = await User.create({
            name,
            username,
            email,
            password,
            role,
            profilepict,
            location,
            createdAt: new Date(),
            updatedAt: new Date()
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
