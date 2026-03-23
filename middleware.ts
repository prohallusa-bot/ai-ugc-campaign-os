import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

let clerkMiddlewareHandler: ((req: NextRequest, evt: any) => Promise<NextResponse>) | null = null;

async function getClerkHandler() {
  if (clerkMiddlewareHandler) return clerkMiddlewareHandler;

  const { clerkMiddleware, createRouteMatcher } = await import(
    "@clerk/nextjs/server"
  );

  const isPublicRoute = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhooks(.*)",
  ]);

  clerkMiddlewareHandler = clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  }) as any;

  return clerkMiddlewareHandler!;
}

export default async function middleware(request: NextRequest) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Skip Clerk middleware if no valid key is configured
  if (!publishableKey || !publishableKey.startsWith("pk_")) {
    return NextResponse.next();
  }

  const handler = await getClerkHandler();
  return handler(request, {} as any);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
