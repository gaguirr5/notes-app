import { Note } from "@/types/Note";
import BaseRespository from "./BaseRepository";
import { ObjectId } from "mongodb";

export default class NotesRepository extends BaseRespository<Note> {
  protected collectionName: string = "notes";

  async findById(id: string): Promise<Note | null> {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) });
  }

  async findAllByUser(userId: string): Promise<Note[]> {
    const collection = await this.getCollection();
    return collection.find({ userId }).sort({ createdAt: -1 }).toArray();
  }

  async create(note: Omit<Note, "_id">): Promise<Note> {
    const collection = await this.getCollection();
    const result = await collection.insertOne(note);
    return { ...note, _id: result.insertedId };
  }

  async update(
    id: string,
    updates: Partial<Pick<Note, "title" | "content">>
  ): Promise<Note | null> {
    const collection = await this.getCollection();
    return collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
  }

  async remove(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}
