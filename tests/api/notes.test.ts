import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/auth", () => ({
  getUserIdFromRequest: vi.fn(),
}));

import { getUserIdFromRequest } from "@/lib/auth";
import { GET } from "@/app/api/notes/route";

describe("GET /api/notes", () => {
  it("returns 401 when not authenticated", async () => {
    vi.mocked(getUserIdFromRequest).mockReturnValue(null);

    const request = new NextRequest("http://localhost:3000/api/notes");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });
});