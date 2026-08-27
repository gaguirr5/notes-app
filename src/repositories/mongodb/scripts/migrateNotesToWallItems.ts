//08/27/26
import { config } from "dotenv";
config({ path: ".env.local" });

import { NoteDocument } from "@/types/Note";
import { WallItemType } from "@/types/WallItem";
import { MongoClient } from "mongodb";

async function migrate() {
  const uri = process.env.DB_URI;

  if (!uri) {
    throw new Error("Missing DB_URI environment variable");
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("notesapp");

  const oldNotes = await db
    .collection<NoteDocument>("notes")
    .find({})
    .toArray();
  console.log(`Found ${oldNotes.length} notes`);

  const wallItems = oldNotes.map((note: NoteDocument, idx) => ({
    _id: note._id,
    userId: note.userId,
    type: WallItemType.Note,
    x: (idx % 4) * 300,
    y: Math.floor(idx / 4) * 250,
    content: {
      title: note.title,
      content: note.content,
    },
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  }));

  if (wallItems.length > 0) {
    await db.collection("wallItems").insertMany(wallItems);
    console.log(`inserted ${wallItems.length} into wallItems collection`);
  }

  await client.close();
}

migrate().catch(console.error);
