import Order from "../../../../../db/models/Order";
import User from "../../../../../db/models/User";

export async function GET(request) {
  try {
    const userId = request.headers.get("x-user-id");
    const filter = {};
    const sort = {};

    request.nextUrl.searchParams.forEach((value, key) => {
      if (key.startsWith("filter_")) {
        const filterKey = key.replace("filter_", "");

        // Split the filter value if it's a comma-separated string
        if (filterKey === "status") {
          filter[filterKey] = value.split(","); // Split the string into an array
        } else {
          filter[filterKey] = value; // Other filters can remain as is
        }
      } else if (key.startsWith("sort_")) {
        const sortKey = key.replace("sort_", "");
        sort[sortKey] = value === "asc" ? 1 : -1;
      }
    });

    const user = await User.findById(userId);

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const orders = await Order.findByUserId(userId, filter, sort);
    return Response.json(orders);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
