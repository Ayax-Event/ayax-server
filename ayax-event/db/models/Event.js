

import database from "../confiq/mongodb";
import { z } from "zod";
import { hashPassword } from "@/helpers/bcrypt";

const EventSchema = z.object({
    event: z.string(),
    description: z.string(),
    category:z.string(),
    tags: z.string(),
    thumbnail: z.string(),
    images: z.array(z.string()),
    createdAt: z.date().min(new Date()),
    updatedAt: z.date().min(new Date()),
});