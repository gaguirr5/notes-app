"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
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
import { useTheme } from "@mui/material/styles";

export default function NotesPage() {
  const router = useRouter();
  const theme = useTheme();
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
      await mutate();
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
    <Container maxWidth="xl" sx={{ mt: { xs: 4, sm: 8 } }}>
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontFamily: "var(--font-script)" }}>
          My Board
        </Typography>
        <Button
          variant="contained"
          onClick={openCreateDialog}
          sx={{
            mt: 1,
            color: theme.custom.navTextColor,
            backgroundColor: theme.custom.navBackground,
            "&:hover": {
              opacity: 0.85,
            },
          }}
        >
          New Note
        </Button>
      </Box>

      {!notesFound && <Typography>No notes yet.</Typography>}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {notesFound &&
          notes.map((note) => (
            <Card
              key={note._id?.toString()}
              sx={{ width: { xs: "100%", sm: 280 } }}
            >
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
          ))}
      </Box>

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
    </Container>
  );
}
