import { NextResponse } from "next/server";
import { verifyWithJose } from "./helpers/jwt";
import { cookies } from "next/headers";

export async function middleware(request) {
  const authorization = cookies().get("Authorization")?.value;
  // if (!authCookie) {
  //   throw new Error("invalid token")
  // }

  if (
    request.nextUrl.pathname.startsWith("/") ||
    request.nextUrl.pathname.startsWith("/eo-list") ||
    request.nextUrl.pathname.startsWith("/add-user")
  ) {
    if (!authorization) {
      return NextResponse.redirect(new URL("/login", request.url));
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
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  if (
    request.nextUrl.pathname.startsWith("/api/user-events") ||
    request.nextUrl.pathname.startsWith("/api/current-user") ||
    request.nextUrl.pathname.startsWith("/api/event-edit") ||
    request.nextUrl.pathname.startsWith("/api/change-password") ||
    request.nextUrl.pathname.startsWith("/api/addAdmin") ||
    request.nextUrl.pathname.startsWith("/api/add-event") ||
    request.nextUrl.pathname.startsWith("/api/user-request") ||
    request.nextUrl.pathname.startsWith("/api/approve-request") ||
    request.nextUrl.pathname.startsWith("/api/get-order") ||
    request.nextUrl.pathname.startsWith("/api/create-order") ||
    request.nextUrl.pathname.startsWith("/api/checkin-order")
  ) {
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

  // if (!authorization) {
  //   return Response.redirect(new URL("/login", request.url));
  // }
  // if (request.nextUrl.pathname.startsWith("/event")) {
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/user-events/:path*",
    "/api/current-user/:path*",
    "/api/event-edit/:path*",
    "/api/change-password/:path*",
    "/api/addAdmin/:path*",
    "/api/user-request/:path*",
    "/api/add-event/:path*",
    "/api/approve-request/:path*",
    "/api/get-order/:path*",
    "/api/create-order/:path*",
    "/api/checkin-order/:path*",
    "/",
    "/eo-list",
    "/add-user",
  ],
};
