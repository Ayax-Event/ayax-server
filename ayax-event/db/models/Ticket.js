import { ObjectId } from "mongodb";
import database from "../confiq/mongodb";

export default class Ticket {
  static collection() {
    return database.collection("tickets");
  }

  static async createTicket(eventId, userId, ticket) {
    const newTicket = {
      eventId: eventId,
      eoId: new ObjectId(userId),
      type: ticket.type,
      price: ticket.price,
      stock: +ticket.stock,
    };
    console.log("new ticket: ", newTicket);
    console.log(newTicket);

    return this.collection().insertOne(newTicket);
  }

  static async getAllTicket() {
    return this.collection().find().toArray();
  }

  static async findByTicketId(_id) {
    return await this.collection().findOne({ _id: new ObjectId(_id) });
  }

  static async updateTicketStock(_id, stock) {
    return await this.collection().updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: { stock },
      }
    );
  }
}
