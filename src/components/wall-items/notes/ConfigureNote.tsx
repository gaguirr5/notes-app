import { createWallItem, updateWallItem } from "@/lib/api/wall-items";
import { NoteFormValues } from "@/types/Note";
import {
  NoteWallItem,
  WallItem,
  WallItemCreation,
  WallItemType,
} from "@/types/WallItem";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyedMutator } from "swr";

interface ConfigureNoteProps {
  edit?: NoteWallItem;
  position?: { x: number; y: number };
  mutate: KeyedMutator<WallItem[]>;
  onClose: () => void;
}

export default function ConfigureNote({
  edit,
  position,
  mutate,
  onClose,
}: ConfigureNoteProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormValues>({
    defaultValues: edit ? edit.content : { content: "" },
  });

  const [formError, setFormError] = useState("");

  const onSubmitNote = async (data: NoteFormValues) => {
    try {
      if (!edit) {
        const newNote: WallItemCreation = {
          x: position?.x ?? 0,
          y: position?.y ?? 0,
          content: data,
          type: WallItemType.Note,
        };
        await createWallItem(newNote);
      } else {
        await updateWallItem(edit._id, { content: data });
      }
      await mutate();
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save note");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit(onSubmitNote)}>
        <DialogTitle>{edit ? "Edit Note" : "New Note"}</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField label="Title" autoFocus {...register("title")} />
          <TextField
            label="Content"
            placeholder="Today is going to be a great day"
            multiline
            rows={4}
            {...register("content", { required: "Content is required" })}
            error={!!errors.content}
            helperText={errors.content?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
