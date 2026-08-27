import { User, UserDocument } from "@/types/User";
import BaseRepository from "./BaseRepository";
import { convertObjectIdToString } from "./mongoHelper";

export default class UsersRepository extends BaseRepository<UserDocument> {
  protected collectionName: string = "users";

  async findByEmail(email: string): Promise<User | null> {
    const collection = await this.getCollection();
    const doc = await collection.findOne({ email });
    if (!doc) return null;
    return convertObjectIdToString(doc);
  }

  async create(user: Omit<User, "_id">): Promise<User> {
    const collection = await this.getCollection();
    const result = await collection.insertOne(user as any); //need to look at this with OptionalId
    return { ...user, _id: result.insertedId.toString() };
  }
}
