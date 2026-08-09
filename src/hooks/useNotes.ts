import { getNotes } from "@/lib/api/notes";
import { Note } from "@/types/Note";
import useSWR from "swr";

export default function useNotes() {
  const url = "/api/notes";
  return useSWR<Note[]>(url, getNotes);
}
