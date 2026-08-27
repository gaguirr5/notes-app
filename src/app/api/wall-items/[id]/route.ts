import { getUserIdFromRequest } from "@/lib/auth";
import WallItemRepository from "@/repositories/mongodb/WallItemRepository";
import WallItemService from "@/services/WallItemService";
import { ApiParams, IdParam } from "@/types/ApiParams";
import { WallItemUpdate } from "@/types/WallItem";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: ApiParams<IdParam>
) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const repo = new WallItemRepository();
    const service = new WallItemService(repo);
    const item = await service.getByUser(id, userId);

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: ApiParams<IdParam>
) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body: WallItemUpdate = await request.json();

    const repo = new WallItemRepository();
    const service = new WallItemService(repo);
    const updated = await service.update(id, userId, body);

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: ApiParams<IdParam>
) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const repo = new WallItemRepository();
    const service = new WallItemService(repo);
    await service.remove(id, userId);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
}
