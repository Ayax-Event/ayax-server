import Category from "../../../../db/models/Category";

export const GET = async (request) => {
  try {
    const categories = await Category.getAll();

    return Response.json(categories, { status: 200 });
  } catch (error) {
    console.log(error);
  }
};
