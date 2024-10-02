
import Event from "../../../../../db/models/Event";

export async function GET(request, { params }) {
    try {
        const _id = params._id;

        const event = await Event.findById(_id);
        if (!event) {
            throw { message: "Event not found", status: 404 };
        }
        return Response.json(event)
    } catch (error) {

        const message = error.message || "Internal server error";
        const status = error.status || 500;

        return Response.json({ message }, { status });
    }
}

