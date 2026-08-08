import { NextRequest, NextResponse } from "next/server";
import UserService from "@/services/UserService";
import UsersRepository from "@/repositories/mongodb/UsersRepository";
import { signToken } from "@/lib/jwt";
import { stringIsBlank } from "@/lib/strings";

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

    const usersRepository = new UsersRepository();
    const userService = new UserService(usersRepository);
    const user = await userService.verifyLogin(email, password);

    if (!user || !user._id) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({ userId: user._id.toString() });

    const response = NextResponse.json({ id: user._id, email: user.email });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days, in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
