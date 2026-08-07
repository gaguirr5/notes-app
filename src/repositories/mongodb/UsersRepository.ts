import { User } from "@/types/User";
import BaseRespository from "./BaseRepository";

export default class UsersRepository extends BaseRespository<User> {
  protected collectionName: string = "users";

  async findByEmail(email: string): Promise<User | null> {
    const collection = await this.getCollection();
    return collection.findOne({ email });
  }

  async create(user: Omit<User, "_id">): Promise<User> {
    const collection = await this.getCollection();
    const result = await collection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }
}
