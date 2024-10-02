import User from "../../../../db/models/User";

export const GET = async (request) => {
  try {
    const userId = request.headers.get("x-user-id");
    const findUser = await User.findById(userId);

    return Response.json(findUser, { status: 200 });
  } catch (error) {
    console.log(error);

    return Response.json(error);
  }
};
