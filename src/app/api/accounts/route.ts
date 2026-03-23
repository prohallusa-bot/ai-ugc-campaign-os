import { NextRequest, NextResponse } from "next/server";
import { apiHandler, parsePagination } from "@/lib/api-handler";
import { accountService } from "@/services";
import { createAccountSchema } from "@/lib/validators";

export const GET = apiHandler(async (req) => {
  const pagination = parsePagination(req);
  const result = await accountService.list(pagination);
  return NextResponse.json({ success: true, data: result });
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const validated = createAccountSchema.parse(body);
  const result = await accountService.create(validated);
  return NextResponse.json({ success: true, data: result }, { status: 201 });
});
