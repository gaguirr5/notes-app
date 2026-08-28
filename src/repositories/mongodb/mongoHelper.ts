import { ObjectId } from "mongodb";
// Converts a document's ObjectId `_id` to a string. Uses a distributive
// conditional type (T extends ... ? ... : never) so that when T is a
// union (like WallItemDocument), each variant is converted individually
// and its specific `type`/`content` pairing is preserved — a plain
// generic would collapse the union into one merged, overly-generic shape.

export function convertObjectIdToString<T extends { _id: ObjectId }>(
  doc: T
): T extends { _id: ObjectId } ? Omit<T, "_id"> & { _id: string } : never {
  const { _id, ...rest } = doc;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { ...rest, _id: _id.toString() } as any;
}

export function convertArrObjIdsToString<T extends { _id: ObjectId }>(
  docs: T[]
): (T extends { _id: ObjectId } ? Omit<T, "_id"> & { _id: string } : never)[] {
  return docs.map((doc) => convertObjectIdToString(doc));
}
