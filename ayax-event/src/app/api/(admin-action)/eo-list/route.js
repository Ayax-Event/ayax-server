import User from "../../../../../db/models/User";

export const GET = async (request) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const itemsPerPage = parseInt(url.searchParams.get("itemsPerPage")) || 10;

    const { data, pagination } = await User.getAllEo(page, itemsPerPage);

    return Response.json(
      {
        data,
        pagination,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};
