import Event from "../../../../../db/models/Event";
import Ticket from "../../../../../db/models/Ticket";
import User from "../../../../../db/models/User";

export async function GET(request) {
  const userId = request.headers.get("x-user-id");
  const result = await Event.findByUserId(userId);
  return Response.json(result, { status: 200 });
}
export async function POST(request) {
  const userId = request.headers.get("x-user-id");
  const findEo = await User.findById(userId);

  if (findEo.role !== "eo") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const newEvent = await Event.create(body, userId);
  const { insertedId: eventId } = newEvent;

  const { ticketInfo } = body;

  for (const ticket of ticketInfo) {
    await Ticket.createTicket(eventId, ticket);
  }

  return Response.json(
    { message: `New event being added ${body.eventName}` },
    { status: 200 }
  );
}
