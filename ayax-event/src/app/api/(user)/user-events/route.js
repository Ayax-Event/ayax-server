import { NextResponse } from "next/server";
import Event from "../../../../../db/models/Event";
import { writeFile } from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(request) {
  const userId = request.headers.get("x-user-id");
  const result = await Event.findByUserId(userId);
  return NextResponse.json(result, { status: 200 });
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const eventName = formData.get("eventName");
    const categoryId = formData.get("categoryId");
    const description = formData.get("description");
    const dateOfEvent = formData.get("dateOfEvent");
    const location = formData.get("location");
    const tags = JSON.parse(formData.get("tags"));
    const tickets = JSON.parse(formData.get("tickets"));

    const thumbnail = formData.get("thumbnail");
    const images = formData.getAll("images");
    console.log("thumbnail: ", thumbnail);
    let thumbnailPath = null;
    let imagePaths = [];

    if (thumbnail && thumbnail.size > 0) {
      const buffer = Buffer.from(await thumbnail.arrayBuffer());
      const filename = Date.now() + "-" + thumbnail.name.replaceAll(" ", "_");
      const filepath = path.join(process.cwd(), "public/uploads", filename);
      await writeFile(filepath, buffer);
      thumbnailPath = "/uploads/" + filename;
    }

    for (const image of images) {
      if (image && image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = Date.now() + "-" + image.name.replaceAll(" ", "_");
        const filepath = path.join(process.cwd(), "public/uploads", filename);
        await writeFile(filepath, buffer);
        imagePaths.push("/uploads/" + filename);
      }
    }

    // Log the received data
    console.log({
      eventName,
      categoryId,
      description,
      dateOfEvent,
      location,
      tags,
      tickets,
      thumbnail: thumbnailPath,
      images: imagePaths,
    });

    // Here you can save the event data to your database
    // For example, creating a new event in your database
    // const newEvent = await Event.create({
    //   eventName,
    //   categoryId,
    //   description,
    //   dateOfEvent,
    //   location,
    //   tags,
    //   tickets,
    //   thumbnailPath,
    //   imagePaths
    // });

    return NextResponse.json(
      { message: "Event created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
