

import database from "../confiq/mongodb";
import { z } from "zod";


const EventSchema = z.object({
    eventName: z.string(),
    userId: z.string(),
    categoryId: z.string(),
    description: z.string(),
    tags: z.string().optional(),
    thumbnail: z.string(),
    images: z.string(),
    dateOfEvent: z.date(),
    isFree: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export default class Event {
    static collection() {

        return database.collection("events")
    }
    static async findAll(page, search, limit, sort) {
        const itemsPerPage = limit ? Number(limit) : 6;
        const currentPage = !page ? 1 : Number(page);
        const skip = (currentPage - 1) * itemsPerPage;
        let query = {};
        if (search) {
            query = {
                eventName: {
                    $regex: search,
                    $options: "si",
                },
            };
        }
        console.log(query, "<<<<<<<<<<<<<<query params models events");

        const sortOrder = sort === "desc" ? -1 : 1;

        const totalData = await this.collection().countDocuments(query);
        const totalPages = Math.ceil(totalData / itemsPerPage);

        const data = await this.collection().find(query).sort({ name: sortOrder }).skip(skip).limit(itemsPerPage).toArray();
        console.log(data, "<<<<<<<<<<<<< data models event");

        return {
            data, pagination: {
                currentPage,
                totalPages,
                totalData,
                hasPrevPage: currentPage > 1,
                hasNextPage: currentPage < totalPages,
            },
        };
    }
    static async findById(id) {

        return await this.collection().findOne(id)
    }
    static async findByUserId(userId) {

        return await this.collection().findOne(userId)
    }
    static async findByName(eventname) {

        return await this.collection().findOne(eventname)
    }
    static async create(event) {
        EventSchema.parse(event);

        return await this.collection().insertOne(event).next()
    }
    static async update(event) {
        EventSchema.parse(event);

        return await this.collection().updateMany(event).next()
    }
    static async delete(event) {

        return await this.collection().deleteOne(event).next()
    }
}