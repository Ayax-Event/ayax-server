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

  static async findByUserId(userId, filter = {}, sort = {}) {
    const matchStage = {
      $match: {
        userId: new ObjectId(String(userId)),
      },
    };

    // Add additional filter conditions
    Object.entries(filter).forEach(([key, value]) => {
      if (!["status", "eventType"].includes(key)) {
        matchStage.$match[key] = value;
      }
    });

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
    ];

    // Add conditional stages for paid events (upcoming or historical)
    if (filter.status === "paid") {
      pipeline.push(
        {
          $lookup: {
            from: "events",
            localField: "eventId",
            foreignField: "_id",
            as: "event",
          },
        },
        { $unwind: "$event" }
      );

      if (filter.eventType === "upcoming") {
        pipeline.push({
          $match: {
            "event.dateOfEvent": { $gt: new Date() },
          },
        });
      } else if (filter.eventType === "historical") {
        pipeline.push({
          $match: {
            "event.dateOfEvent": { $lte: new Date() },
          },
        });
      }
    } else if (filter.status) {
      // If status filter is present but not "paid", add it to the match stage
      matchStage.$match.status = filter.status;
    }

    // Add sort stage if sort parameter is provided
    if (Object.keys(sort).length > 0) {
      pipeline.push({ $sort: sort });
    }

    return await this.collection().aggregate(pipeline).toArray();
  }
}
