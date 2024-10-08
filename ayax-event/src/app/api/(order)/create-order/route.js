import Order from "../../../../../db/models/Order.js";
import Ticket from "../../../../../db/models/Ticket.js";
import Midtrans from "midtrans-client";

export async function POST(request) {
  try {
    const userId = request.headers.get("x-user-id");
    console.log(userId, "<<<<<<<<<<<<<<< user id");
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
      eventId,
    } = await request.json();

    console.log(ticketQuantity, ticketType, ticketId, "ini dari frontend");
    const ticketDetail = await Ticket.findByTicketId(ticketId);
    const { type, price, stock } = ticketDetail;
    if (+stock < ticketQuantity) {
      return Response.json({ message: "Stock is not enough" }, { status: 400 });
    }

    await Ticket.updateTicketStock(ticketId, Number(stock) - ticketQuantity);

    const gross_amount = +price * ticketQuantity;

    const newOrder = await Order.createOrder(
      userId,
      email,
      firstName,
      lastName,
      phoneNumber,
      ticketQuantity,
      ticketType,
      ticketId,
      eventId,
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

    return Response.json(transactionToken, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(error, { status: 500 });
  }
}
