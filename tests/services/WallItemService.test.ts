import { describe, it, expect, vi, beforeEach } from "vitest";
import WallItemService from "@/services/WallItemService";
import WallItemRepository from "@/repositories/mongodb/WallItemRepository";
import { WallItem, WallItemType } from "@/types/WallItem";

function createMockRepository() {
  return {
    findAllByUser: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  } as unknown as WallItemRepository;
}

// const wallItem = {
//   _id: Math.random().toString(),
//   userId: "user-1",
//   x: Math.random(),
//   y: Math.random(),
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

// function makeItem(
//   type: WallItemTypeValue,
//   overrides: Partial<WallItem> = {}
// ): WallItem {
//   return {
//     ...wallItem,
//     type,
//     content: {
//       title: "Test node",
//       content: "123",
//     },
//     ...overrides,
//   };
// }

describe("WallItemService", () => {
  let mockRepo: WallItemRepository;
  let wallItemService: WallItemService;

  beforeEach(() => {
    mockRepo = createMockRepository();
    wallItemService = new WallItemService(mockRepo);
  });

  describe("create", () => {
    it("throws when title is too long", async () => {
      const noteData = {
        type: WallItemType.Note,
        x: 0,
        y: 0,
        content: { title: "x".repeat(201), content: "test" },
      };
      await expect(wallItemService.create("user-1", noteData)).rejects.toThrow(
        "Title must be 200 characters or fewer"
      );
    });
    it("throws when content is too long", async () => {
      const noteData = {
        type: WallItemType.Note,
        x: 0,
        y: 0,
        content: { content: "x".repeat(10001) },
      };
      await expect(wallItemService.create("user-1", noteData)).rejects.toThrow(
        "Content must be 10000 characters or fewer"
      );
    });

    it("throws when coordinates are missing", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const noteData = {
        type: WallItemType.Note,
        x: undefined,
        y: undefined,
        content: { content: "test" },
      } as any;
      await expect(wallItemService.create("user-1", noteData)).rejects.toThrow(
        "Coordinates missing"
      );
    });

    it("creates a valid note successfully", async () => {
      vi.mocked(mockRepo.create).mockImplementation(
        async (item) =>
          ({
            ...item,
            _id: "generated-id",
          }) as WallItem
      );

      const noteData = {
        type: WallItemType.Note,
        x: 100,
        y: 200,
        content: { title: "Hello", content: "World" },
      };

      const result = await wallItemService.create("user-1", noteData);
      expect(result.userId).toBe("user-1");
      expect(mockRepo.create).toHaveBeenCalledOnce();
    });
  });
});
