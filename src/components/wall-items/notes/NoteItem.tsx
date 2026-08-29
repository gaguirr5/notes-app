import { NoteWallItem, WallItem, WallItemType } from "@/types/WallItem";
import { Card, CardContent, Typography } from "@mui/material";
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
      <Card
        key={_id}
        sx={{
          position: "relative",
          width: { xs: "100%", sm: 280 },
          borderRadius: 2,
          // transform: "rotate(-.8deg)",
          boxShadow: "2px 3px 8px rgba(0,0,0,0.15)",
          // "&:hover": {
          //   transform: "rotate(0deg) scale(1.02)",
          //   boxShadow: "4px 6px 16px rgba(0,0,0,0.2)",
          // },
          // "&::before": {
          //   content: '""',
          //   position: "absolute",
          //   top: 0,
          //   left: 0,
          //   right: 0,
          //   height: "30%",
          //   // bgcolor: "rgba(255,255,255,0.4)",
          //   borderRadius: "2px 2px 0 0",
          //   pointerEvents: "none",
          // },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "0 0 16px 16px",
            borderColor: "transparent transparent rgba(0,0,0,0.08) transparent",
          },
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          style={{
            position: "absolute",
            top: 1,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))",
          }}
        >
          <defs>
            <radialGradient id="pinHead" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#ff6b6b" />
              <stop offset="100%" stopColor="#c0392b" />
            </radialGradient>
          </defs>
          <circle cx="14" cy="14" r="10" fill="url(#pinHead)" />
          <circle cx="14" cy="14" r="5" fill="rgba(0,0,0,0.2)" />
        </svg>
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
