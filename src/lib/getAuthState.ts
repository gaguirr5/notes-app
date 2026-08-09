import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function getAuthState(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = token ? verifyToken(token) : null;
  return payload !== null;
}
