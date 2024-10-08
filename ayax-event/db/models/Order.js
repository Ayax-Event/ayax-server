import { ObjectId } from "mongodb";
import database from "../confiq/mongodb";

export default class Order {
  static collection() {
    return database.collection("orders");
  }

  static async createOrder(
    userId,
    email,
    firstName,
    lastName,
    phoneNumber,
    ticketQuantity,
    ticketType,
    ticketId,
    eventId,
    price
  ) {
    const order = {
      userId: new ObjectId(userId),
      buyerDetail: {
        firstName,
        lastName,
        email,
        phoneNumber,
      },
      ticket: {
        ticketId,
        quantity: ticketQuantity,
        type: ticketType,
      },
      price,
      eventId,
      status: "pending",
    };
    return await this.collection().insertOne(order);
  }

  static async updateStatus(orderId, status) {
    return this.collection().updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: { status },
      }
    );
  }

  static async findOrderById(_id) {
    return await this.collection().findOne({ _id: new ObjectId(_id) });
  }
}
