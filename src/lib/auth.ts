import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function getUserIdFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  return payload?.userId ?? null;
}