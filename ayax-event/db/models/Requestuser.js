import { ObjectId } from "mongodb";
import database from "../confiq/mongodb";
import { z } from "zod";

export const RequestuserSchema = z.object({
    userId: z.instanceof(ObjectId),
    status: z.string(),
    descriprion: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export default class Requestuser {
    static collection() {
        return database.collection("userRequests")
    }

    static async create(userId, status, description) {
        try {
            console.log(description, "<<<<<<<<< body model create");

            const newRequest = {
                userId: new ObjectId(String(userId)),
                status: status,
                description: description,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            // RequestuserSchema(newRequest)
            return await this.collection().insertOne(newRequest)
        } catch (error) {
            console.log(error, "error message in create model")
        }

    }
    static async getAllReq() {
        return await this.collection().aggregate([
            {
              $match:
                {
                  status: "pending"
                }
            },
            {
              $lookup:
                {
                  from: "users",
                  localField: "userId",
                  foreignField: "_id",
                  as: "userDetail"
                }
            },
            {
              $unwind:
                {
                  path: "$userDetail",
                  preserveNullAndEmptyArrays: true
                }
            }
          ]).toArray();


    }
    static async findById(requestId) {
        const result = await this.collection().aggregate([
            {
                $match: { _id: new ObjectId(String(requestId)) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetail'
                }
            }
        ]).toArray();

        return result[0];
    }
    static async updateStatus(requestId, status) {
        return await this.collection().updateOne({
            _id: new ObjectId(String(requestId))
        }, {
            $set: {
                status
            }
        })
    }
}