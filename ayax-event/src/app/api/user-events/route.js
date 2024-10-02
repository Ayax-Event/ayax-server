import Event from "../../../../db/models/Event";

export async function GET(request) {
  const userId = request.headers.get("x-user-id");

  const result = await Event.findByUserId(userId);

  return Response.json(result, { status: 200 });
}
