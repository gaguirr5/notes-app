import { describe, it, expect, vi, beforeEach } from "vitest";
import WallItemService from "@/services/WallItemService";
import WallItemRepository from "@/repositories/mongodb/WallItemRepository";
import { Note } from "@/types/Note";
import { NoteWallItem, WallItem } from "@/types/WallItem";

function createMockRepository() {
  return {
    findAllByUser: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  } as unknown as WallItemRepository;
}

const wallItem = {
  _id: Math.random().toString(),
  userId: "user-1",
  x: Math.random(),
  y: Math.random(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makeNote(overrides: Partial<NoteWallItem> = {}): WallItem {
  return {
    ...wallItem,
    type: "note",
    content: {
      title: "Test node",
      content: "123",
    },
    ...overrides,
  };
}

describe("WallItemService", () => {
  let mockRepo: WallItemRepository;
  let wallItemService: WallItemService;

  beforeEach(() => {
    mockRepo = createMockRepository();
    wallItemService = new WallItemService(mockRepo);
  });

  describe("create", () => {
    const note = makeNote({
      content: { title: "x".repeat(201), content: "test" },
    });
    it("title is too long", async () => {
      await expect(wallItemService.create(note._id, note)).rejects.toThrow(
        `Title must be 200 characters or fewer`
      );
    });

    // it("defaults content to an empty string when omitted", async () => {
    //   vi.mocked(mockRepo.create).mockImplementation(
    //     async (note) => note as Note
    //   );

    //   await wallItemService.create("user-1", "My Title");

    //   expect(mockRepo.create).toHaveBeenCalledWith(
    //     expect.objectContaining({ content: "" })
    //   );
    // });
  });

  // describe("getNoteForUser — authorization", () => {
  //   it("throws when the note doesn't exist", async () => {
  //     vi.mocked(mockRepo.findById).mockResolvedValue(null);

  //     await expect(
  //       wallItemService.getNoteForUser("note-1", "user-1")
  //     ).rejects.toThrow("Note not found");
  //   });

  //   it("throws when the note belongs to a different user", async () => {
  //     vi.mocked(mockRepo.findById).mockResolvedValue(
  //       makeNote({ userId: "someone-else" })
  //     );

  //     await expect(
  //       wallItemService.getNoteForUser("note-1", "user-1")
  //     ).rejects.toThrow("Note not found");
  //   });

  //   it("returns the note when it belongs to the requesting user", async () => {
  //     const note = makeNote({ userId: "user-1" });
  //     vi.mocked(mockRepo.findById).mockResolvedValue(note);

  //     const result = await wallItemService.getNoteForUser("note-1", "user-1");

  //     expect(result).toEqual(note);
  //   });
  // });
});
