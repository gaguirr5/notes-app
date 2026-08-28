import { getWallItems } from "@/lib/api/wall-items";
import { WallItem } from "@/types/WallItem";
import useSWR from "swr";

export default function useWallItems() {
  const url = "/api/wall-items";
  return useSWR<WallItem[]>(url, getWallItems);
}
