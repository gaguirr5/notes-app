import { Note } from "@/types/Note";

export async function getNotes(): Promise<Note[]> {
  const res = await fetch("/api/notes");
  if (!res.ok) throw new Error("Failed to load notes");

  return res.json();
}

export async function createNote(
  title: string,
  content: string
): Promise<Note> {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create note");

  return data;
}

export async function updateNote(
  id: string,
  title: string,
  content: string
): Promise<Note> {
  const res = await fetch(`/api/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to update note");
  }
  return data;
}

export async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete note");
}
