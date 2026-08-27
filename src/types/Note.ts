import { ObjectId } from "mongodb";

export interface Note {
  _id?: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteDocument extends Omit<Note, "_id"> {
  _id: ObjectId;
}

export interface NoteFormValues {
  title: string;
  content: string;
}
