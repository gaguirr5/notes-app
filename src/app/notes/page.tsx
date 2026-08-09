"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { createNote, updateNote, deleteNote } from "@/lib/api/notes";
import { Note, NoteFormValues } from "@/types/Note";
import useNotes from "@/hooks/useNotes";
import { Grid } from "@mui/material";

export default function NotesPage() {
  const router = useRouter();
  const { data: notes, error, isLoading, mutate } = useNotes();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormValues>();

  if (error) {
    router.push("/login");
    return null;
  }

  const notesFound = !!notes && notes.length > 0;

  const openCreateDialog = () => {
    setEditingNote(null);
    reset({ title: "", content: "" });
    setFormError("");
    setDialogOpen(true);
  };

  const openEditDialog = (note: Note) => {
    setEditingNote(note);
    reset({ title: note.title, content: note.content });
    setFormError("");
    setDialogOpen(true);
  };

  const onSubmitNote = async ({ title, content }: NoteFormValues) => {
    setFormError("");
    try {
      if (editingNote) {
        await updateNote(editingNote._id!.toString(), title, content);
      } else {
        await createNote(title, content);
      }
      await mutate(); // re-fetch and update the cache
      setDialogOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save note");
    }
  };

  const onDeleteNote = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    try {
      await deleteNote(id);
      await mutate();
    } catch {
      alert("Failed to delete note");
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 8 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">My Wall</Typography>
        <Button variant="contained" onClick={openCreateDialog} sx={{ mt: 1 }}>
          New Note
        </Button>
      </Box>

      {!notesFound && <Typography>No notes yet.</Typography>}
      <Grid container spacing={2}>
        {notesFound &&
          notes!.map((note) => (
            <Grid key={note._id?.toString()} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{note.title}</Typography>
                  <Typography variant="body2">{note.content}</Typography>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => openEditDialog(note)} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => onDeleteNote(note._id!.toString())}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleSubmit(onSubmitNote)}>
          <DialogTitle>{editingNote ? "Edit Note" : "New Note"}</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField
              label="Title"
              autoFocus
              {...register("title", { required: "Title is required" })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              label="Content"
              multiline
              rows={4}
              {...register("content")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
