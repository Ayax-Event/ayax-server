import { ObjectId } from "mongodb";
import Event from "../../../../../db/models/Event";
//update event by event id
export async function POST(request) {
    try {
        const {
            _id,
            eventName,
            description,
            tags,
            categoryId,
        } = await request.json();
     
        // console.log(
        //     _id,
        //     eventName,
        //     description,
        //     tags,
        //     categoryId,
        //     "body update event"
        // );
        
        const userId = request.headers.get("x-user-id");
        const event = await Event.findById(new ObjectId(String(_id)));
        if (!event) {
            return Response.json({ message: "Event not found" }, { status: 404 });
        }
        if (event.userId.toString() !== userId) {
            return Response.json({ message: "You are not authorized to update this event" }, { status: 403 });
        }
        const updatedEvent = await Event.update(
            _id,
            eventName,
            description,
            tags,
            new ObjectId(String(categoryId)),
        );
        return Response.json(updatedEvent);
    } catch (error) {
        console.log(error, "error message in update event");
        
        // return Response.json({ message: error.message }, { status: 500 });
    }
}