import {
  ChecklistWallItem,
  NoteWallItem,
  TimerWallItem,
  WallItem,
  WallItemType,
} from "@/types/WallItem";

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 10000;
const MAX_SMALL_CONTENT_LENGTH = 200;
const MAX_LIST_LENGTH = 25;

function validateNote({ content: { title, content } }: NoteWallItem): void {
  if (title && title.length > MAX_TITLE_LENGTH) {
    throw new Error(`Title must be ${MAX_TITLE_LENGTH} characters or fewer`);
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    throw new Error(
      `Content must be ${MAX_CONTENT_LENGTH} characters or fewer`
    );
  }
}

function validateChecklist({ content: { list } }: ChecklistWallItem): void {
  if (list.length > MAX_LIST_LENGTH) {
    throw new Error(`Max list limit is ${MAX_LIST_LENGTH} items`);
  }
  list.forEach((item, i) => {
    if (item.item.length > MAX_SMALL_CONTENT_LENGTH) {
      throw new Error(`Item ${i + 1} in list is too long`);
    }
  });
}

function validateTimer({ content: { time } }: TimerWallItem): void {
  if (!time) {
    throw new Error("Missing timer duration");
  }
}

export function validateWallItem(data: WallItem): void {
  if (!data) throw new Error("No data found");
  if (!data.x || !data.y) throw new Error("Coordinates missing");

  switch (data.type) {
    case WallItemType.Note:
      return validateNote(data);
    case WallItemType.Checklist:
      return validateChecklist(data);
    case WallItemType.Timer:
      return validateTimer(data);
    case WallItemType.Task:
    case WallItemType.Calculator:
    case WallItemType.ScientificCalculator:
    case WallItemType.GraphingCalculator:
      return; // no additional validation yet
    default:
      throw new Error("Unknown wall item type");
  }
}
