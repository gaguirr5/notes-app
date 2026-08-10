import { getCurrentUser } from "@/lib/api/auth";
import useSWR from "swr";

export default function useUser() {
  return useSWR("/api/auth/me", getCurrentUser);
}
