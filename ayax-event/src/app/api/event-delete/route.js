import Event from "../../../db/models/Event"

export async function DELETE(request) {
    try {
      const body = await request.json()
      const userId = request.headers.get("x-user-id");

      const findAdmin = await User.findById(userId);
      if (findAdmin.role !== "admin") {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
      }
      await Event.delete(body._id)
  
      return Response.json({ message: "Successfuly removed from wishlist!" }, { status: 200 })
    } catch (error) {
      return Response.json(error)
    }
  }