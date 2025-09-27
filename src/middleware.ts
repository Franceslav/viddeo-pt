import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/profile"]

export default async function middleware(req: NextRequest) {
  const session = await auth()

  // Проверяем защищенные маршруты
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (!session && isProtected) {
    const absoluteUrl = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }


  return NextResponse.next();
}
