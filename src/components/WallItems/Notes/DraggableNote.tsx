import { NoteWallItem, WallItem } from "@/types/WallItem";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { KeyedMutator } from "swr";
import NoteItem from "./NoteItem";

interface DraggableNoteProps {
  item: NoteWallItem;
  mutate: KeyedMutator<WallItem[]>;
}

export default function DraggableNote({ item, mutate }: DraggableNoteProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item._id,
  });

  const style = {
    position: "absolute" as const,
    left: item.x,
    top: item.y,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      data-item-id={item._id}
      style={style}
      {...listeners}
      {...attributes}
    >
      <NoteItem data={item} mutate={mutate} />
    </div>
  );
}
