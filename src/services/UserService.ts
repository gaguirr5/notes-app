import bcrypt from "bcryptjs";
import UsersRepository from "@/repositories/mongodb/UsersRepository";
import { User } from "@/types/User";
import { isValidEmail } from "@/lib/strings";

const SALT_ROUNDS = 10;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 max
const MAX_PASSWORD_LENGTH = 128;

export default class UserService {
  constructor(private usersRepository: UsersRepository) {}

  async signup(email: string, password: string): Promise<User> {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email address");
    }
    if (email.length > MAX_EMAIL_LENGTH) {
      throw new Error("Email is too long");
    }
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
      throw new Error("Password is too long");
    }

    const existing = await this.usersRepository.findByEmail(email);
    if (existing) {
      throw new Error("Email already in use");
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    return this.usersRepository.create({
      email,
      passwordHash,
      createdAt: new Date(),
    });
  }

  async verifyLogin(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }
}
