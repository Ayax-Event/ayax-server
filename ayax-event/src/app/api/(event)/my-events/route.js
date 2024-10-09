import Event from "../../../../../db/models/Event";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || null;
    const limit = searchParams.get("limit") || null;
    const search = {};
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith("search_")) {
        search[key.replace("search_", "")] = value;
      }
    }
    const filter = {};
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith("filter_")) {
        filter[key.replace("filter_", "")] = value;
      }
    }
    const sort = {};
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith("sort_")) {
        sort[key.replace("sort_", "")] = value;
      }
    }
    const result = await Event.findAll(page, search, limit, sort, filter);

    return Response.json(result, { status: 200 });
  } catch (error) {
    const message = error.message || "Internal server error";
    const status = error.status || 500;
    return Response.json({ message }, { status });
  }
}
