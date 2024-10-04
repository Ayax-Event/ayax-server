import User from "../../../../../db/models/User";

export const GET = async (request) => {
  try {
    const eoList = await User.getAllEo();

    return Response.json(eoList, { status: 200 });
  } catch (error) {
    return Response.status(500).json({ message: error.message });
  }
};
