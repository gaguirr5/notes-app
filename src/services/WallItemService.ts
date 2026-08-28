import WallItemRepository from "@/repositories/mongodb/WallItemRepository";
import { WallItem, WallItemCreation, WallItemUpdate } from "@/types/WallItem";
import { validateWallItem } from "@/lib/wallItemHelper";

export default class WallItemService {
  constructor(private repo: WallItemRepository) {}

  async getById(id: string): Promise<WallItem> {
    const item = await this.repo.findById(id);
    if (!item) throw new Error("Item not found");
    return item;
  }

  async getByUser(id: string, userId: string): Promise<WallItem> {
    const item = await this.repo.findByUser(id, userId);
    if (!item) throw new Error("Item not found");
    return item;
  }

  async getAllByUser(userId: string): Promise<WallItem[]> {
    return await this.repo.findAllByUser(userId);
  }

  async create(userId: string, data: WallItemCreation): Promise<WallItem> {
    const item = { ...data, userId } as WallItem;
    validateWallItem(item);

    const today = new Date();
    return this.repo.create({
      ...item,
      createdAt: today,
      updatedAt: today,
    });
  }

  async update(
    id: string,
    userId: string,
    updates: WallItemUpdate
  ): Promise<WallItem> {
    const existing = await this.getByUser(id, userId); // confirms ownership first
    if (!existing) throw new Error("Item does not exist");

    const merged = {
      ...existing,
      ...updates,
    } as WallItem;

    validateWallItem(merged);
    const updated = await this.repo.update(id, updates);
    if (!updated) throw new Error("Item was not updated");

    return updated;
  }

  async remove(id: string, userId: string): Promise<void> {
    const existing = await this.repo.findByUser(id, userId); // confirms ownership first
    if (!existing) throw new Error("Item not found");
    await this.repo.remove(id);
  }
}
