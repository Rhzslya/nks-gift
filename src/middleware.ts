import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const res = NextResponse.next();
  // Define paths that are considered public (accessible without a token)
  const isPublicPath = [
    "/",
    "/sign-in",
    "/sign-up",
    "/verifyemail",
    "/checkemail",
    "/reset-password",
    "/forgot-password",
    "/products",
  ].includes(path);

  // Capture Origins
  const allowedOrigins = [
    "http://localhost:3000",
    "https://nks-gift.vercel.app",
  ];
  const origin = req.headers.get("origin") || "";

  // Append CORS headers if the origin is allowed
  if (allowedOrigins.includes(origin)) {
    res.headers.append("Access-Control-Allow-Origin", origin);
  }

  if (origin && !allowedOrigins.includes(origin)) {
    // Jika origin tidak diizinkan, kembalikan response 403 Forbidden
    return new NextResponse("Forbidden", { status: 403 });
  }
  console.log("Origin: ", req.headers.get("origin"));
  console.log("Referer: ", req.headers.get("referer"));
  // add the remaining CORS headers to the response
  res.headers.append("Access-Control-Allow-Credentials", "true");
  res.headers.append(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT"
  );
  res.headers.append(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Define paths that are restricted to admin users
  const onlyAdmin = path.startsWith("/admin");

  // Get the token from the request
  const token = await getToken({ req, secret: process.env.TOKEN_SECRET });

  if (isPublicPath && token) {
    // If trying to access a public path with a token, redirect to the home page
    console.log(
      "Redirecting to the home page because the path is public and a token was found"
    );
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // If trying to access a protected path without a token, redirect to the sign-in page
  if (!isPublicPath && !token) {
    console.log(
      "Redirecting to the sign-in page because the path is protected and no token was found"
    );
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("callbackUrl", encodeURI(req.url));
    return NextResponse.redirect(url, { status: 303 });
  }

  // If trying to access an admin path without admin privileges, redirect to the home page
  if (
    onlyAdmin &&
    (typeof token?.role !== "string" ||
      !["admin", "super_admin", "manager"].includes(token.role))
  ) {
    console.log(
      "Redirecting to the home page because the path is admin and the user is not an admin"
    );
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return res;
}

// It specifies the paths for which this middleware should be executed.
export const config = {
  matcher: [
    "/about",
    "/profile",
    "/sign-in",
    "/sign-up",
    "/verifyemail",
    "/checkemail",
    "/reset-password",
    "/forgot-password",
    "/dashboard/:path*",
    "/404",
    "/not-found",
    "/settings/:path*",
    "/admin/:path*",
    "/admin/users",
  ],
};
