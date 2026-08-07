import { getDb } from "@/lib/mongodb";
import { Collection, Document as MongoDocument } from "mongodb";

export default abstract class BaseRespository<T extends MongoDocument> {
  protected abstract collectionName: string;
  protected async getCollection(): Promise<Collection<T>> {
    const db = await getDb();
    return db.collection<T>(this.collectionName);
  }
}
