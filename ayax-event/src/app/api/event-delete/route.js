import Event from "../../../../db/models/Event";
import User from "../../../../db/models/User";


export async function DELETE(request) {
    try {
        console.log("MASUKKKKKKKKKK");

        const body = await request.json()

        const userId = request.headers.get("x-user-id");
        console.log("user id: ", userId);

        const findAdmin = await User.findById(userId);
        console.log(findAdmin, "<<<<<<<<<<< admin");

        if (findAdmin.role !== "admin") {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }
        const event = await Event.delete(body._id)
        if (!event) {
            return Response.json({ message: "Data not found" }, { status: 404 })
        }

        return Response.json({ message: "Successfuly removed Event!" }, { status: 200 })
    } catch (error) {
        return Response.json(error)
    }
}