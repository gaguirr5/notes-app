import { NextRequest, NextResponse } from "next/server";
import UserService from "@/services/UserService";
import UsersRepository from "@/repositories/mongodb/UsersRepository";
import { stringIsBlank } from "@/lib/strings";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (stringIsBlank(email)) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (stringIsBlank(password)) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rateLimitKey = `signup:${ip}`;
    const { success, resetInSeconds } = await checkRateLimit(rateLimitKey);
    if (!success) {
      return NextResponse.json(
        {
          error: `Too many signup attempts. Try again in ${Math.ceil(resetInSeconds / 60)} minutes.`,
        },
        { status: 429 }
      );
    }

    const usersRepository = new UsersRepository();
    const userService = new UserService(usersRepository);
    const user = await userService.signup(email, password);

    return NextResponse.json(
      { id: user._id, email: user.email },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
