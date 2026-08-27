import { ObjectId } from "mongodb";
//get rid of _id ObjectId type and add back as string type

export function convertObjectIdToString<T extends { _id: ObjectId }>(
  doc: T
): Omit<T, "_id"> & { _id: string } {
  const { _id, ...rest } = doc;
  return { ...rest, _id: _id.toString() };
}

export function convertArrObjIdsToString<T extends { _id: ObjectId }>(
  docs: T[]
): (Omit<T, "_id"> & { _id: string })[] {
  return docs.map((doc) => convertObjectIdToString(doc));
}
