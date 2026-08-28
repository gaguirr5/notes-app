import { ObjectId } from "mongodb";

export interface User {
  _id?: string;
  email: string;
  displayName?: string;
  passwordHash: string;
  createdAt: Date;
}

export interface UserDocument extends Omit<User, "_id"> {
  _id: ObjectId;
}
