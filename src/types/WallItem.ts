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
  _id?: ObjectId;
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
  dueDate: Date;
  complete: boolean;
}
export interface TimerContent {
  title: string;
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

export type WallItem =
  | (WallItemBase & {
      type: typeof WallItemType.Note;
      content: NoteContent;
    })
  | (WallItemBase & {
      type: typeof WallItemType.Checklist;
      content: CheckListContent;
    })
  | (WallItemBase & { type: typeof WallItemType.Task; content: TaskContent })
  | (WallItemBase & { type: typeof WallItemType.Timer; content: TimerContent })
  | (WallItemBase & {
      type: typeof WallItemType.Calculator;
      content: CalculatorContent;
    })
  | (WallItemBase & {
      type: typeof WallItemType.ScientificCalculator;
      content: ScientificCalculatorContent;
    })
  | (WallItemBase & {
      type: typeof WallItemType.GraphingCalculator;
      content: GraphingCalculatorContent;
    });
