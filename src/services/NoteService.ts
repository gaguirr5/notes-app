import NotesRepository from "@/repositories/mongodb/NotesRepository";
import { Note } from "@/types/Note";
import { stringIsBlank } from "@/lib/strings";

export default class NoteService {
  constructor(private repo: NotesRepository) {}

  async getUserNotes(userId: string): Promise<Note[]> {
    return this.repo.findAllByUser(userId);
  }

  async getNoteForUser(id: string, userId: string): Promise<Note> {
    const note = await this.repo.findById(id);
    if (!note || note.userId !== userId) throw new Error("Note not found");
    return note;
  }

  async create(
    userId: string,
    title: string,
    content: string = ""
  ): Promise<Note> {
    if (stringIsBlank(title)) throw new Error("Title is required");
    const today = new Date();
    return this.repo.create({
      userId,
      title,
      content,
      createdAt: today,
      updatedAt: today,
    });
  }
}
