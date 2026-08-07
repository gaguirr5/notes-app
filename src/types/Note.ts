// src/types/note.ts
import { ObjectId } from "mongodb";

export interface Note {
  _id?: ObjectId;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
