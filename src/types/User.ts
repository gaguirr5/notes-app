import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  email: string;
  displayName?: string;
  passwordHash: string;
  createdAt: Date;
}
