import { NextResponse } from "next/server";
import Event from "../../../../../db/models/Event";
import cloudinary from "../../../../lib/cloudinary";
import Ticket from "../../../../../db/models/Ticket";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    console.log("PROCESS....");
    const userId = request.headers.get("x-user-id");
    const formData = await request.formData();
    console.log(formData);
    // return new Response("OK", { status: 200 });

    const eventName = formData.get("eventName");
    const categoryId = formData.get("categoryId");
    const description = formData.get("description");
    const dateOfEvent = formData.get("dateOfEvent");
    const longtitude = formData.get("longtitude");
    const latitude = formData.get("latitude");
    const tags = JSON.parse(formData.get("tags"));
    const tickets = JSON.parse(formData.get("tickets"));

    // // Handle thumbnail upload
    const thumbnail = formData.get("thumbnail");
    let thumbnailUrl = null;
    if (thumbnail) {
      const uploadResult = await cloudinary.uploader.upload(thumbnail, {
        folder: "thumbnails",
      });
      thumbnailUrl = uploadResult.secure_url;
    }

    const images = formData.getAll("images");

    const imageUrls = [];
    for (const image of images) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "event-images",
      });
      imageUrls.push(uploadResult.secure_url);
    }

    const newEvent = await Event.create(
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
    );

    for (const ticket of tickets) {
      await Ticket.createTicket(newEvent.insertedId, userId, ticket);
    }

    return Response.json(
      {
        message: "Event created successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
