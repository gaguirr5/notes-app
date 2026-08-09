import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import NoteService from "@/services/NoteService";
import NotesRepository from "@/repositories/mongodb/NotesRepository";
import { ApiParams, IdParam } from "@/types/ApiParams";

export async function GET(
  request: NextRequest,
  { params }: ApiParams<IdParam>
) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const notesRepository = new NotesRepository();
    const noteService = new NoteService(notesRepository);
    const note = await noteService.getNoteForUser(id, userId);

    return NextResponse.json(note);
  } catch {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: ApiParams<IdParam>
) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await getOwnedNoteOrThrow(id, userId);

    const body = await request.json();
    const { title, content } = body;

    const notesRepository = new NotesRepository();
    const updated = await notesRepository.update(id, { title, content });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: ApiParams<IdParam>
) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await getOwnedNoteOrThrow(id, userId);

    const notesRepository = new NotesRepository();
    await notesRepository.remove(id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }
}

async function getOwnedNoteOrThrow(id: string, userId: string) {
  const notesRepository = new NotesRepository();
  const noteService = new NoteService(notesRepository);
  return noteService.getNoteForUser(id, userId);
}
