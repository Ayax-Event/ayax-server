import Order from "../../../../../db/models/Order.js";
import Ticket from "../../../../../db/models/Ticket.js";
import Midtrans from "midtrans-client";

export async function POST(request) {
  const userId = request.headers.get("x-user-id");
  const snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });
  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    ticketQuantity,
    ticketType,
    ticketId,
  } = await request.json();

  const ticketDetail = await Ticket.findByTicketId(ticketId);
  const { type, price, stock } = ticketDetail;
  if (stock < ticketQuantity)
    return Response.json({ message: "Stock is not enough" }, { status: 400 });

  const gross_amount = price * ticketQuantity;

  const newOrder = await Order.createOrder(
    userId,
    email,
    firstName,
    lastName,
    phoneNumber,
    ticketQuantity,
    ticketType,
    ticketId,
    gross_amount
  );

  const parameter = {
    transaction_details: {
      order_id: newOrder.insertedId.toString(),
      gross_amount,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phoneNumber,
    },
  };

  const transactionToken = await snap.createTransaction(parameter);
  console.log(transactionToken);
  return Response.json(transactionToken, { status: 200 });
}
