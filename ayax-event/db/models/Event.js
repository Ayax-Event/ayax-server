import { ObjectId } from "mongodb";
import database from "../confiq/mongodb";
import { z } from "zod";

const EventSchema = z.object({
  eventName: z.string(),
  userId: z.instanceof(ObjectId),
  categoryId: z.instanceof(ObjectId),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string(),
  images: z.array(z.string()),
  location: z.string(),
  dateOfEvent: z.string(),
  isFree: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export default class Event {
  static collection() {
    return database.collection("events");
  }

  static async findAll(page, search, limit, sort, filter) {
    const itemsPerPage = limit ? Number(limit) : 6;
    const currentPage = !page ? 1 : Number(page);
    const skip = (currentPage - 1) * itemsPerPage;

    let matchStage = {};

    // Handle search
    if (Object.keys(search).length > 0) {
      Object.keys(search).forEach((key) => {
        matchStage[key] = { $regex: search[key], $options: "si" };
      });
    }

    // Handle filter
    if (Object.keys(filter).length > 0) {
      Object.keys(filter).forEach((key) => {
        if (key === "categoryId") {
          matchStage[key] = new ObjectId(filter[key]);
        } else {
          matchStage[key] = filter[key];
        }
      });
    }

    // Handle sort
    const sortStage = {};
    if (Object.keys(sort).length > 0) {
      Object.keys(sort).forEach((key) => {
        sortStage[key] = sort[key].toLowerCase() === "desc" ? -1 : 1;
      });
    } else {
      sortStage.createdAt = -1;
    }

    const pipeline = [
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $unwind: {
          path: "$creator",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "creator.password": 0,
        },
      },
      {
        $facet: {
          metadata: [
            { $count: "totalData" },
            {
              $addFields: {
                currentPage: currentPage,
                itemsPerPage: itemsPerPage,
                totalPages: {
                  $ceil: {
                    $divide: ["$totalData", itemsPerPage],
                  },
                },
                hasPrevPage: { $gt: [currentPage, 1] },
              },
            },
            {
              $addFields: {
                hasNextPage: {
                  $lt: ["$currentPage", "$totalPages"],
                },
              },
            },
          ],
          data: [
            { $sort: sortStage },
            { $skip: skip },
            { $limit: itemsPerPage },
          ],
        },
      },
    ];

    const result = await this.collection().aggregate(pipeline).next();

    return {
      data: result.data || [],
      pagination: result.metadata[0] || {
        currentPage,
        totalPages: 0,
        totalData: 0,
        hasPrevPage: false,
        hasNextPage: false,
      },
    };
  }

  static async findById(_id) {
    const pipeline = [
      {
        $match: {
          _id: new ObjectId(String(_id)),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $project: {
          "creator.password": 0,
        },
      },
      {
        $unwind: {
          path: "$creator",
        },
      },
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "eventId",
          as: "tickets",
        },
      },
      {
        $lookup: {
          from: "orders",
          let: { eventId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$eventId", "$$eventId"] },
                    { $eq: ["$status", "paid"] },
                  ],
                },
              },
            },
          ],
          as: "attendees",
        },
      },
    ];

    return await this.collection().aggregate(pipeline).next();
  }

  static async findWithAttendees(_id) {
    const pipeline = [
      {
        $match: {
          _id: new ObjectId(String(_id)),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $project: {
          "creator.password": 0,
        },
      },
      {
        $unwind: {
          path: "$creator",
        },
      },
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "eventId",
          as: "tickets",
        },
      },
      {
        $lookup: {
          from: "orders",
          let: { eventId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$eventId", "$$eventId"] },
                    { $eq: ["$status", "paid"] },
                  ],
                },
              },
            },
          ],
          as: "attendees",
        },
      },
    ];

    return await this.collection().aggregate(pipeline).next();
  }

  static async findByUserId(userId) {
    return await this.collection()
      .find({
        userId: new ObjectId(String(userId)),
      })
      .toArray();
  }

  static async create(
    userId,
    eventName,
    categoryId,
    description,
    dateOfEvent,
    longtitude,
    latitude,
    tags,
    thumbnailUrl,
    imageUrls
  ) {
    const newEvent = {
      eventName: eventName,
      userId: new ObjectId(userId),
      categoryId: new ObjectId(categoryId),
      description: description,
      location: { longtitude, latitude },
      tags: tags,
      thumbnail: thumbnailUrl,
      images: imageUrls,
      dateOfEvent: dateOfEvent,
      isActive: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("new event being created: ", newEvent);
    return await this.collection().insertOne(newEvent);
  }
  static async update(_id, eventName, description, tags, categoryId) {
    const event = {
      eventName,
      description,
      tags,
      categoryId,
      updatedAt: new Date(),
    };

    // console.log(event, "after schema event in model");

    return await this.collection().updateOne(
      { _id: new ObjectId(_id) },
      { $set: event }
    );
  }
  static async delete(eventId) {
    console.log("eventId models: ", eventId);
    return await this.collection()
      .deleteOne({ _id: new ObjectId(String(eventId)) })
      .next();
  }
  static async updateStatus(eventId, isActive) {
    console.log("eventId models: ", eventId);

    return await this.collection().updateOne(
      { _id: new ObjectId(String(eventId)) },
      {
        $set: { isActive },
      }
    );
  }
}
