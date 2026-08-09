import { MongoClient, Db } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.DB_URI;
  if (!uri) {
    throw new Error("Missing DB_URI environment variable");
  }

  // In dev, Next.js hot-reloads modules on every file change.
  // Without caching, that would spawn a new MongoClient (and new connection)
  // on every single reload — quickly exhausting your connection limit.
  // We cache the client on the global object so it survives hot reloads.
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }

  // In production, there's no hot-reloading, so a plain per-server-instance
  // cache is fine — but still only created the first time it's needed.
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db("notesapp");
}
