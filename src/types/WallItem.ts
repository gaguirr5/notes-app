import { ObjectId } from "mongodb";

export const WallItemType = {
  Note: "note",
  Checklist: "checklist",
  Task: "task",
  Timer: "timer",
  Calculator: "calculator",
  ScientificCalculator: "scientific-calculator",
  GraphingCalculator: "graphing-calculator",
} as const;

export type WallItemTypeValue =
  (typeof WallItemType)[keyof typeof WallItemType];

export interface WallItemBase {
  _id: string;
  userId: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteContent {
  title?: string;
  content: string;
  color?: string; //TODO- add color options
}
export interface CheckListContent {
  title?: string;
  list: {
    complete: boolean;
    item: string;
  }[];
}
export interface TaskContent {
  title?: string;
  content: string;
  dueDate?: Date;
  complete: boolean;
}
export interface TimerContent {
  title?: string;
  time: number;
}
export interface CalculatorContent {
  expression: string; //Todo-figure out shape
}
export interface ScientificCalculatorContent {
  expression: string; //Todo-figure out shape
}
export interface GraphingCalculatorContent {
  expression: string; //Todo-figure out shape
}

export interface NoteWallItem extends WallItemBase {
  type: typeof WallItemType.Note;
  content: NoteContent;
}

export interface ChecklistWallItem extends WallItemBase {
  type: typeof WallItemType.Checklist;
  content: CheckListContent;
}

export interface TaskWallItem extends WallItemBase {
  type: typeof WallItemType.Task;
  content: TaskContent;
}

export interface TimerWallItem extends WallItemBase {
  type: typeof WallItemType.Timer;
  content: TimerContent;
}

export interface CalculatorWallItem extends WallItemBase {
  type: typeof WallItemType.Calculator;
  content: CalculatorContent;
}

export interface ScientificCalculatorWallItem extends WallItemBase {
  type: typeof WallItemType.ScientificCalculator;
  content: ScientificCalculatorContent;
}

export interface GraphingCalculatorWallItem extends WallItemBase {
  type: typeof WallItemType.GraphingCalculator;
  content: GraphingCalculatorContent;
}

export type WallItem =
  | NoteWallItem
  | ChecklistWallItem
  | TaskWallItem
  | TimerWallItem
  | CalculatorWallItem
  | ScientificCalculatorWallItem
  | GraphingCalculatorWallItem;

export type WallItemCreation = Omit<
  WallItem,
  "userId" | "_id" | "createdAt" | "updatedAt"
>;

export type WallItemUpdate = Partial<
  Pick<WallItemBase, "x" | "y" | "width" | "height">
> & {
  content?: WallItem["content"];
};

type AsDocument<T extends { _id: string }> = Omit<T, "_id"> & { _id: ObjectId };

export type WallItemDocument =
  | AsDocument<NoteWallItem>
  | AsDocument<ChecklistWallItem>
  | AsDocument<TaskWallItem>
  | AsDocument<TimerWallItem>
  | AsDocument<CalculatorWallItem>
  | AsDocument<ScientificCalculatorWallItem>
  | AsDocument<GraphingCalculatorWallItem>;
