import { describe, it, expect, vi, beforeEach } from "vitest";
import UserService from "@/services/UserService";
import UsersRepository from "@/repositories/mongodb/UsersRepository";
import { User } from "@/types/User";

function createMockRepository() {
  return {
    findByEmail: vi.fn(),
    create: vi.fn(),
  } as unknown as UsersRepository;
}

describe("UserService", () => {
  let mockRepo: UsersRepository;
  let userService: UserService;

  beforeEach(() => {
    mockRepo = createMockRepository();
    userService = new UserService(mockRepo);
  });

  describe("signup", () => {
    it("throws for an invalid email", async () => {
      await expect(
        userService.signup("not-an-email", "password123", "Alex")
      ).rejects.toThrow("Invalid email address");
    });

    it("throws for a short password", async () => {
      await expect(
        userService.signup("test@test.com", "short", "Alex")
      ).rejects.toThrow("Password must be at least 8 characters");
    });

    it("throws for a display name that's too long", async () => {
      const longName = "a".repeat(51);
      await expect(
        userService.signup("test@test.com", "password123", longName)
      ).rejects.toThrow("Display name must be 50 characters or fewer");
    });

    it("throws when the email is already in use", async () => {
      vi.mocked(mockRepo.findByEmail).mockResolvedValue({
        email: "test@test.com",
        displayName: "Existing User",
        passwordHash: "hashed",
        createdAt: new Date(),
      } as User);

      await expect(
        userService.signup("test@test.com", "password123", "Alex")
      ).rejects.toThrow("Email already in use");
    });

    it("creates a user with a hashed password when input is valid", async () => {
      vi.mocked(mockRepo.findByEmail).mockResolvedValue(null);
      vi.mocked(mockRepo.create).mockImplementation(async (user) => ({
        ...user,
        _id: undefined,
      }));

      const result = await userService.signup(
        "test@test.com",
        "password123",
        "Alex"
      );

      expect(result.email).toBe("test@test.com");
      expect(result.displayName).toBe("Alex");
      expect(result.passwordHash).not.toBe("password123");
      expect(mockRepo.create).toHaveBeenCalledOnce();
    });

    it("creates a user successfully without a display name", async () => {
      vi.mocked(mockRepo.findByEmail).mockResolvedValue(null);
      vi.mocked(mockRepo.create).mockImplementation(async (user) => ({
        ...user,
        _id: undefined,
      }));

      const result = await userService.signup(
        "test@test.com",
        "password123",
        undefined
      );

      expect(result.email).toBe("test@test.com");
      expect(result.displayName).toBeUndefined();
    });
  });
});
