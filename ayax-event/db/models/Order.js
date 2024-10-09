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
      eventId: new ObjectId(eventId),
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

  static async findOrderById(orderId) {
    return await this.collection()
      .aggregate([
        {
          $match: { _id: new ObjectId(orderId) },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "events",
            localField: "eventId",
            foreignField: "_id",
            as: "event",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $unwind: "$event",
        },
      ])
      .next();
  }

  static async findByUserId(userId, filter = {}, sort = {}) {
    console.log("Filter:", filter);
    const matchStage = {
      $match: {
        userId: new ObjectId(String(userId)),
      },
    };

    // Handle multiple statuses using $or
    if (filter.status && Array.isArray(filter.status)) {
      matchStage.$match.$or = filter.status.map((status) => ({ status }));
    } else if (filter.status) {
      // If it's a single value (not an array), handle it as a single condition
      matchStage.$match.status = filter.status;
    }

    const pipeline = [
      matchStage,
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          "user.password": 0,
          "user.createdAt": 0,
          "user.updatedAt": 0,
          "user.location": 0,
          "event.description": 0,
          "event.images": 0,
          "event.tags": 0,
        },
      },
    ];

    if (filter.eventType === "upcoming") {
      pipeline.push({
        $match: {
          "event.dateOfEvent": { $gt: new Date() },
        },
      });

      console.log("Checking for upcoming events after:", new Date());
    } else if (filter.eventType === "historical") {
      pipeline.push({
        $match: {
          "event.dateOfEvent": { $lte: new Date() },
        },
      });
    }

    if (Object.keys(sort).length > 0) {
      pipeline.push({ $sort: sort });
    }

    console.log("Pipeline:", JSON.stringify(pipeline, null, 2));

    return await this.collection().aggregate(pipeline).toArray();
  }

  static async checkInOrder(orderId) {
    return this.collection().updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { checkedIn: new Date() } }
    );
  }

  static async addPaymentUrl(orderId, url) {
    return this.collection().updateOne(
      { _id: orderId },
      { $set: { paymentUrl: url } }
    );
  }
}
