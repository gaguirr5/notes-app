import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/getAuthState";

export default async function Home() {
  const isLoggedIn = await getAuthState();
  redirect(isLoggedIn ? "/home" : "/login");
}
