import Order from "../../../../../db/models/Order";
import User from "../../../../../db/models/User";

export async function POST(request) {
  try {
    const { orderId } = await request.json();
    const userId = request.headers.get("x-user-id");

    if (!orderId || !userId) {
      return new Response("Missing orderId or userId", { status: 400 });
    }

    const findUser = await User.findUserById(userId);
    if (!findUser) {
      return new Response("User not found", { status: 404 });
    }

    console.log(orderId, "<<<<<<<<<<<<<<< order id");
    const order = await Order.findOrderById(orderId);
    console.log(order, "<<<<<<<<<<<<<<< order");
    if (order.event.userId.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (order.checkedIn) {
      return new Response("Order already checked in", { status: 400 });
    }

    await Order.checkInOrder(orderId);

    return new Response("Order checked in successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
