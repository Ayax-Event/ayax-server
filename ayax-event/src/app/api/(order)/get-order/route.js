import Order from "../../../../../db/models/Order";
import User from "../../../../../db/models/User";

export async function GET(request) {
  try {

    const userId = request.headers.get("x-user-id");
    console.log(userId, "<<<<<<<<<<<<<<< user id");
    
    const user = await User.findById(userId);
    console.log(user,"<<<<<<<<<<<<< user");
    
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    const orders = await Order.findByUserId(userId);
    console.log(orders, "<<<<<<<<<<<<<<< orders");
    return Response.json(orders);
  } catch (error) {
    return Response.json(error);
  }
}