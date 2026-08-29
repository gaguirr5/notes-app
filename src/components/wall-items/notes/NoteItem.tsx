import { NoteWallItem, WallItem, WallItemType } from "@/types/WallItem";
import { Box, Card, CardContent, Typography } from "@mui/material";
import ItemActions from "../ItemActions";
import { deleteWallItem } from "@/lib/api/wall-items";
import ConfigureNote from "./ConfigureNote";
import { KeyedMutator } from "swr";
import { useState } from "react";
import DeleteItemDialog from "../DeleteItemDialog";

interface NoteItemProps {
  data: NoteWallItem;
  mutate: KeyedMutator<WallItem[]>;
}

export default function NoteItem({ data, mutate }: NoteItemProps) {
  const {
    _id,
    content: { title, content },
  } = data;

  const [openEditNote, setOpenEditNote] = useState(false);
  const [openDeleteNoteDialog, setOpenDeleteNoteDialog] = useState(false);

  const handleDeleteNote = async () => {
    if (!confirm("Delete this note?")) return;
    try {
      await deleteWallItem(_id);
      mutate();
      setOpenDeleteNoteDialog(false);
    } catch {
      alert("Failed to delete note");
    }
  };

  return (
    <>
      <Card key={_id} sx={{ width: { xs: "100%", sm: 280 } }}>
        <CardContent>
          <ItemActions
            item={data}
            onEdit={() => setOpenEditNote(true)}
            onDelete={() => setOpenDeleteNoteDialog(true)}
          />
          <Typography variant="h6">{title ?? ""}</Typography>
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {content}
          </Typography>
        </CardContent>
      </Card>

      {openEditNote && (
        <ConfigureNote
          edit={data}
          mutate={mutate}
          onClose={() => setOpenEditNote(false)}
        />
      )}

      {openDeleteNoteDialog && (
        <DeleteItemDialog
          type={WallItemType.Note}
          title={title}
          onClose={() => setOpenDeleteNoteDialog(false)}
          onDelete={handleDeleteNote}
        />
      )}
    </>
  );
}
