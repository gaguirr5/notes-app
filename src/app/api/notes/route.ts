import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import NoteService from "@/services/NoteService";
import NotesRepository from "@/repositories/mongodb/NotesRepository";

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notesRepository = new NotesRepository();
  const noteService = new NoteService(notesRepository);
  const notes = await noteService.getUserNotes(userId);

  return NextResponse.json(notes);
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, content } = body;

    const notesRepository = new NotesRepository();
    const noteService = new NoteService(notesRepository);
    const note = await noteService.create(userId, title, content);

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create note";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
