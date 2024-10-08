import Event from "../../../../../../db/models/Event";
import User from "../../../../../../db/models/User";

export const GET = async (request, { params }) => {
  try {
    const _id = params._id;
    const userId = request.headers.get("x-user-id");

    const findUser = await User.findUserById(userId);

    if (!findUser) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    if (findUser.role !== "eo") {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const event = await Event.findWithAttendees(_id);
    if (!event) {
      throw { message: "Event not found", status: 404 };
    }
    event.totalRevenue = 0;
    event.attendees.forEach((attendee) => {
      event.totalRevenue += attendee.price;
    });

    return Response.json(event, { status: 200 });
  } catch (error) {
    console.log(error);

    return Response.json({ message: error }, { status: 500 });
  }
};
