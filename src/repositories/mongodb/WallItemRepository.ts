import { WallItem, WallItemDocument, WallItemUpdate } from "@/types/WallItem";
import BaseRepository from "./BaseRepository";
import { ObjectId } from "mongodb";
import {
  convertArrObjIdsToString,
  convertObjectIdToString,
} from "@/repositories/mongodb/mongoHelper";

export default class WallItemRepository extends BaseRepository<WallItemDocument> {
  protected collectionName: string = "wallItems";

  async findById(id: string): Promise<WallItem | null> {
    const collection = await this.getCollection();
    const doc = await collection.findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    return convertObjectIdToString(doc);
  }

  async findByUser(id: string, userId: string): Promise<WallItem | null> {
    const collection = await this.getCollection();
    const doc = await collection.findOne({ _id: new ObjectId(id), userId });
    if (!doc) return null;
    return convertObjectIdToString(doc);
  }

  async findAllByUser(userId: string): Promise<WallItem[]> {
    const collection = await this.getCollection();
    const docs = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    if (!docs || docs.length == 0) return [];
    return convertArrObjIdsToString(docs);
  }

  async create(item: Omit<WallItem, "_id">): Promise<WallItem> {
    const collection = await this.getCollection();
    const result = await collection.insertOne(item as any); //need to look at this with OptionalId
    return { ...item, _id: result.insertedId.toString() } as WallItem;
  }

  async update(id: string, updates: WallItemUpdate): Promise<WallItem | null> {
    const collection = await this.getCollection();
    const doc = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } as any },
      { returnDocument: "after" }
    );
    if (!doc) return null;
    return convertObjectIdToString(doc);
  }

  async remove(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}
