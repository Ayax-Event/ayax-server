
import { verifyWithJose } from "./jwt";
import { cookies } from "next/headers";

export async function middleware(request) {
  const authorization = cookies().get("Authorization")?.value;
  console.log(authorization, "<<<<<<<<<<<< auth middleware");

  if (request.nextUrl.pathname.startsWith("/api/wishlists")) {
    if (!authorization) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [type, token] = authorization.split(" ");
    if (type !== "Bearer" || !token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
      const decoded = await verifyWithJose(token);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", decoded._id);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.log(error, "<<<<<<<<<<<<<<< error middlewares");

      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  if (request.nextUrl.pathname.startsWith("/wishlist")) {
    if (!authorization) {
      return Response.redirect(new URL("/login", request.url));
    }
  }

  return Response.next();
}

export const config = {
  matcher: ["/api/wishlists/:path*", "/wishlist"],
};
