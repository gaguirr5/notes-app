import { WallItem, WallItemCreation, WallItemUpdate } from "@/types/WallItem";

export async function getWallItems(): Promise<WallItem[]> {
  const res = await fetch("/api/wall-items");
  if (!res.ok) throw new Error("Failed to load wall items");
  return res.json();
}

export async function createWallItem(
  item: WallItemCreation
): Promise<WallItem> {
  const res = await fetch("/api/wall-items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Failed to create ${item.type}`);

  return data;
}

export async function updateWallItem(
  id: string,
  updates: WallItemUpdate
): Promise<WallItem> {
  const res = await fetch(`/api/wall-items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update item");
  return data;
}

export async function deleteWallItem(id: string): Promise<void> {
  const res = await fetch(`/api/wall-items/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete item ${id}`);
}
