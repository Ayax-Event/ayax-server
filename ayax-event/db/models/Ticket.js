import database from "../confiq/mongodb";

export default class Ticket {
  static collection() {
    return database.collection("tickets");
  }

  static async createTicket(eventId, ticket) {
    const newTicket = {
      eventId: eventId,
      type: ticket.type,
      price: ticket.price,
      stock: ticket.stock,
    };

    return this.collection().insertOne(newTicket);
  }

  static async getAllTicket() {
    return this.collection().find().toArray();
  }
}
