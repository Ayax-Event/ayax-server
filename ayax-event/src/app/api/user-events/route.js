import { ObjectId } from "mongodb";
import Event from "../../../../db/models/Event";
import User from "../../../../db/models/User";

export async function GET(request) {
  const userId = request.headers.get("x-user-id");
  const result = await Event.findByUserId(userId);
  return Response.json(result, { status: 200 });
}
export async function POST(request) {
  // console.log(request.headers,"header coy");
  const userId = request.headers.get("x-user-id");
  // const findEo = await User.findById(userId)
  // if (findEo.role !== "eo") {
  //   return Response.json({ message: "Unauthorize" }, { status: 401 })
  // }
  const body = await request.json();
  const event = await Event.create(body, userId)
  return Response.json({ message: `New event being added ${body.eventName}` }, { status: 200 })

}
