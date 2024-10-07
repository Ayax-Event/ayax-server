import { NextResponse } from "next/server";
import Requestuser from "../../../../../db/models/Requestuser";
import User from "../../../../../db/models/User";

export async function POST(request) {
    try {
        const userId = request.headers.get("x-user-id");
        const { description } = await request.json()
        console.log(description, "description");

        const status = "pending"
        await Requestuser.create(userId, status, description)
        // console.log(newRequest, "new request");

        return Response.json({ message: "Request sent successfully" }, { status: 200 })
    } catch (error) {
        console.log(error, "api user requestt error");;

    }
}
export async function GET(request) {
    try {
        const userId = request.headers.get("x-user-id");

        const findAdmin = await User.findUserById(userId)

        if (findAdmin.role !== "admin" ) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }
        const userRequest = await Requestuser.getAllReq()

        return NextResponse.json({ message: "Request sent successfully", userRequest }, { status: 200 })
    } catch (error) {
        console.log(error, "api user requestt error");;
    }
}