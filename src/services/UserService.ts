import bcrypt from "bcryptjs";
import UsersRepository from "@/repositories/mongodb/UsersRepository";
import { User } from "@/types/User";

const SALT_ROUNDS = 10;

export default class UserService {
  constructor(private usersRepository: UsersRepository) {}

  async signup(email: string, password: string): Promise<User> {
    const existing = await this.usersRepository.findByEmail(email);
    if (existing) throw new Error("Email already in use");
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
