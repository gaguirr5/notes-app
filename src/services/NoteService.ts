import NotesRepository from "@/repositories/mongodb/NotesRepository";
import { Note } from "@/types/Note";
import { stringIsBlank } from "@/lib/strings";

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 10000;

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
    if (stringIsBlank(title)) {
      throw new Error("Title is required");
    }
    if (title.length > MAX_TITLE_LENGTH) {
      throw new Error(`Title must be ${MAX_TITLE_LENGTH} characters or fewer`);
    }
    if (content.length > MAX_CONTENT_LENGTH) {
      throw new Error(`Content must be ${MAX_CONTENT_LENGTH} characters or fewer`);
    }

    const today = new Date();
    return this.repo.create({
      userId,
      title,
      content,
      createdAt: today,
      updatedAt: today,
    });
  }

  async update(
    id: string,
    userId: string,
    title: string,
    content: string
  ): Promise<Note> {
    await this.getNoteForUser(id, userId); // confirms ownership first

    if (stringIsBlank(title)) {
      throw new Error("Title is required");
    }
    if (title.length > MAX_TITLE_LENGTH) {
      throw new Error(`Title must be ${MAX_TITLE_LENGTH} characters or fewer`);
    }
    if (content.length > MAX_CONTENT_LENGTH) {
      throw new Error(`Content must be ${MAX_CONTENT_LENGTH} characters or fewer`);
    }

    const updated = await this.repo.update(id, { title, content });
    if (!updated) {
      throw new Error("Note not found");
    }
    return updated;
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.getNoteForUser(id, userId); // confirms ownership first
    await this.repo.remove(id);
  }
}