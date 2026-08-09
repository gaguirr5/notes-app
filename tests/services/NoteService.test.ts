import { describe, it, expect, vi, beforeEach } from "vitest";
import NoteService from "@/services/NoteService";
import NotesRepository from "@/repositories/mongodb/NotesRepository";
import { Note } from "@/types/Note";

function createMockRepository() {
  return {
    findAllByUser: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  } as unknown as NotesRepository;
}

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    userId: "user-1",
    title: "Test Note",
    content: "Some content",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("NoteService", () => {
  let mockRepo: NotesRepository;
  let noteService: NoteService;

  beforeEach(() => {
    mockRepo = createMockRepository();
    noteService = new NoteService(mockRepo);
  });

  describe("create", () => {
    it("throws when title is blank", async () => {
      await expect(noteService.create("user-1", "")).rejects.toThrow(
        "Title is required"
      );
    });

    it("defaults content to an empty string when omitted", async () => {
      vi.mocked(mockRepo.create).mockImplementation(
        async (note) => note as Note
      );

      await noteService.create("user-1", "My Title");

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ content: "" })
      );
    });
  });

  describe("getNoteForUser — authorization", () => {
    it("throws when the note doesn't exist", async () => {
      vi.mocked(mockRepo.findById).mockResolvedValue(null);

      await expect(
        noteService.getNoteForUser("note-1", "user-1")
      ).rejects.toThrow("Note not found");
    });

    it("throws when the note belongs to a different user", async () => {
      vi.mocked(mockRepo.findById).mockResolvedValue(
        makeNote({ userId: "someone-else" })
      );

      await expect(
        noteService.getNoteForUser("note-1", "user-1")
      ).rejects.toThrow("Note not found");
    });

    it("returns the note when it belongs to the requesting user", async () => {
      const note = makeNote({ userId: "user-1" });
      vi.mocked(mockRepo.findById).mockResolvedValue(note);

      const result = await noteService.getNoteForUser("note-1", "user-1");

      expect(result).toEqual(note);
    });
  });
});
