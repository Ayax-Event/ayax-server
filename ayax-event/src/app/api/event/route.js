import { cookies } from "next/headers";
import Event from "../../../../db/models/Event";

export async function GET(request) {
    try {
        // const authCookie = cookies.get("Authorization")
        // console.log(authCookie);
        // console.log(request, "req <<<<<<<< api event");

        const userId  = request.headers.get("x-user-id");
        console.log(userId, "<<<<< user coy");
        if (userId) {
            // console.log(userId, "<<<<<<<<<<< userId");
            const eventsByUser = await Event.findByUserId(userId);
            console.log(eventsByUser, "<<<<<<<<<< event by user id");
            return new Response(JSON.stringify(eventsByUser), { status: 200 });
        }
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get("search") || null;
        const page = searchParams.get("page") || null;
        const limit = searchParams.get("limit") || null;
        const sort = searchParams.get("sort") || null;

        const result = await Event.findAll(page, search, limit, sort);
        // console.log(result, "<<<<<<<<<<<< res event get all");

        return Response.json(result, { status: 200 });
    } catch (error) {
        // console.log(error, "<<<<<<<<<<<<<<< error findall");
        const message = error.message || "Internal server error";
        const status = error.status || 500;
        return Response.json({ message }, { status });
    }
}

