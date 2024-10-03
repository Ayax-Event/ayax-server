import { ObjectId } from "mongodb";
import database from "../confiq/mongodb";
import { z } from "zod";

const EventSchema = z.object({
  eventName: z.string(),
  userId: z.instanceof(ObjectId),
  categoryId: z.instanceof(ObjectId),
  description: z.string(),
  tags: z.string().optional(),
  thumbnail: z.string(),
  images: z.string(),
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
    let query = {};

    if (Object.keys(search).length > 0) {
      Object.keys(search).forEach((key) => {
        query[key] = { $regex: search[key], $options: "si" };
      });
    }

    if (Object.keys(filter).length > 0) {
      Object.keys(filter).forEach((key) => {
        if (key === "categoryId") {
          query[key] = new ObjectId(filter[key]);
        } else {
          query[key] = filter[key];
        }
      });
    }

    const sortObject = {};
    if (Object.keys(sort).length > 0) {
      Object.keys(sort).forEach((key) => {
        sortObject[key] = sort[key].toLowerCase() === "desc" ? -1 : 1;
      });
    } else {
      sortObject.createdAt = -1;
    }

    const totalData = await this.collection().countDocuments(query);
    const totalPages = Math.ceil(totalData / itemsPerPage);

    const data = await this.collection()
      .find(query)
      .sort(sortObject)
      .skip(skip)
      .limit(itemsPerPage)
      .toArray();

    return {
      data,
      pagination: {
        currentPage,
        totalPages,
        totalData,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
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

  static async create(body, userId) {
    const newEvent = {
      eventName: body.eventName,
      userId: new ObjectId(userId),
      categoryId: new ObjectId(body.categoryId),
      description: body.description,
      location: body.location,
      tags: body.tags,
      thumbnail: body.thumbnail,
      images: body.images,
      dateOfEvent: body.dateOfEvent,
      isFree: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    EventSchema.parse(newEvent);

    return await this.collection().insertOne(newEvent);
  }
  static async update(event) {
    EventSchema.parse(event);

    return await this.collection().updateMany(event).next();
  }
  static async delete(event) {
    return await this.collection().deleteOne(event).next();
  }
}
