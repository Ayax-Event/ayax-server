import { NextResponse } from "next/server";
import Order from "../../../../../db/models/Order";
import Ticket from "../../../../../db/models/Ticket";

export async function POST(request) {
  try {
    console.log("webhook processing...");
    const body = await request.json();
    console.log("midtrans webhooks: ", body);
    if (body.transaction_status && body.transaction_status === "settlement") {
      await Order.updateStatus(body.order_id, "paid");

      return NextResponse.json({
        message: "Success update order status to paid",
      });
    }
    if (body.transaction_status && body.transaction_status !== "pending") {
      const findOrder = await Order.findOrderById(body.order_id);

      if (!findOrder) {
        return NextResponse.json({
          message: "Order not found",
        });
      }

      const findTicket = await Ticket.findByTicketId(findOrder.ticket.ticketId);
      console.log(findTicket, "<<<<<<<<<<< find ticket");
      await Ticket.updateTicketStock(
        findOrder.ticket.ticketId,
        +findTicket.stock + +findOrder.ticket.quantity
      );

      await Order.updateStatus(body.order_id, body.transaction_status);

      return NextResponse.json({
        message: "Update order to " + body.transaction_status,
      });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 500 }
    );
  }
}
