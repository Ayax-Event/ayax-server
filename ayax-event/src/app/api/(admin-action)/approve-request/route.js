import Requestuser from "../../../../../db/models/Requestuser"
import User from "../../../../../db/models/User"

export const POST = async (request) => {
    try {
        const adminId = await request.headers.get("x-user-id")
        const body = await request.json()
        const { requestId, isApprove } = body

        const findAdmin = await User.findUserById(adminId)
        if (findAdmin.role !== "admin") {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        if (!isApprove) {
            await Requestuser.updateStatus(requestId, "declined")
            return Response.json({ message: "Request Are declined" })
        }

        const findRequest = await Requestuser.findById(requestId)
        // console.log(findRequest, "findreq api/approve-request");
        if (!findRequest) {
            return Response.json({ message: "Request not found" }, { status: 404 })
        }
        await Requestuser.updateStatus(requestId, "approved")
        await User.updateRole(findRequest.userId, "eo")

        return Response.json({ message: "Succcessfully updated status approved" }, { status: 200 })

    } catch (error) {
        return Response.json(error, { status: 500 })
    }
}