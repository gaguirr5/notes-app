import { getUserIdFromRequest } from "@/lib/auth";
import WallItemRepository from "@/repositories/mongodb/WallItemRepository";
import WallItemService from "@/services/WallItemService";
import { WallItemCreation } from "@/types/WallItem";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repo = new WallItemRepository();
  const service = new WallItemService(repo);
  const items = await service.getAllByUser(userId);

  return NextResponse.json(items);
}

//CREATE
export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: WallItemCreation = await request.json();
    if (!body.type) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const repo = new WallItemRepository();
    const service = new WallItemService(repo);

    const item = await service.create(userId, body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create item";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
