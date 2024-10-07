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
      status: "pending",
    };
    return await this.collection().insertOne(order);
  }
}
