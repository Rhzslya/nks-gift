import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest, res: NextResponse) {
  const path = req.nextUrl.pathname;

  // Define paths that are considered public (accessible without a token)

  const isPublicPath =
    path === "/" ||
    path === "/sign-in" ||
    path === "/sign-up" ||
    path === "/verifyemail" ||
    path === "/checkemail" ||
    path === "/reset-password" ||
    path === "/forgot-password";

  const onlyAdmin = path.split("/")[1] === "admin";

  // Get the token from the request
  const token = await getToken({
    req,
    secret: process.env.TOKEN_SECRET,
  });

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

  if (onlyAdmin && token?.isAdmin !== true) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
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
    "/dashboard/:path",
    "/404",
    "/not-found",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
