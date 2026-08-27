import { Note, NoteDocument } from "@/types/Note";
import BaseRepository from "./BaseRepository";
import { ObjectId } from "mongodb";
import {
  convertArrObjIdsToString,
  convertObjectIdToString,
} from "@/repositories/mongodb/mongoHelper";

export default class NotesRepository extends BaseRepository<NoteDocument> {
  protected collectionName: string = "notes";

  async findById(id: string): Promise<Note | null> {
    const collection = await this.getCollection();
    const doc = await collection.findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    return convertObjectIdToString(doc);
  }

  async findAllByUser(userId: string): Promise<Note[]> {
    const collection = await this.getCollection();
    const docs = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    if (!docs) return [];
    return convertArrObjIdsToString(docs);
  }

  async create(note: Omit<Note, "_id">): Promise<Note> {
    const collection = await this.getCollection();
    const result = await collection.insertOne(note as any); //need to look at this with OptionalId
    return { ...note, _id: result.insertedId.toString() };
  }

  async update(
    id: string,
    updates: Partial<Pick<Note, "title" | "content">>
  ): Promise<Note | null> {
    const collection = await this.getCollection();
    const doc = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
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
