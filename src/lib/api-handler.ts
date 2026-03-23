import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/errors";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function apiHandler(
  fn: (
    req: NextRequest,
    ctx: { params: Promise<Record<string, string>> }
  ) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    ctx: { params: Promise<Record<string, string>> }
  ) => {
    try {
      return await fn(req, ctx);
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          {
            success: false,
            error: { code: error.code, message: error.message },
          },
          { status: error.statusCode }
        );
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "NOT_FOUND", message: "Record not found" },
          },
          { status: 404 }
        );
      }
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: error.errors.map((e) => e.message).join(", "),
            },
          },
          { status: 400 }
        );
      }
      console.error("Unhandled error:", error);
      return NextResponse.json(
        {
          success: false,
          error: { code: "INTERNAL_ERROR", message: "Internal server error" },
        },
        { status: 500 }
      );
    }
  };
}

export function parsePagination(req: NextRequest) {
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("pageSize")) || 20)
  );
  return { page, pageSize };
}
