

import database from "../confiq/mongodb";
import { z } from "zod";


const EventSchema = z.object({
    eventname: z.string(),
    userId:z.string(),
    categoryId:z.string(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    thumbnail: z.string(),
    images: z.array(z.string()),
    dateOfEvent: z.date(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export default class Event{
    static collection(){
        return database.collection("events")
    }
    static async findAll(){
        return await this.collection().find().toArray()
    }
    static async findById(id){
        return 
    }
    static async create(event){
        return await this.collection().insertOne(event).next()
    }
}