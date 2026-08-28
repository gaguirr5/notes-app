"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useState } from "react";
import useUser from "@/hooks/useUser";
import { useTheme } from "@mui/material/styles";
import useWallItems from "@/hooks/useWallItems";
import { WallItemType } from "@/types/WallItem";
import ConfigureNote from "@/components/WallItems/Notes/ConfigureNote";
import NoteItem from "@/components/WallItems/Notes/NoteItem";

export default function NotesPage() {
  const router = useRouter();
  const theme = useTheme();
  const { data: notes, error, isLoading, mutate } = useWallItems();

  const { data: user } = useUser();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (error) {
    router.push("/login");
    return null;
  }

  const itemsFound = !!notes && notes.length > 0;
  const displayName = user ? `${user.displayName}'s Wall` : "My Wall";

  const openCreateDialog = () => {
    setDialogOpen(true);
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
          {displayName}
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

      {!itemsFound && <Typography>No notes yet.</Typography>}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {itemsFound &&
          notes.map((item) =>
            item.type === WallItemType.Note ? (
              <NoteItem key={item._id} data={item} mutate={mutate} />
            ) : (
              <Typography key={item._id}>Nothing yet</Typography>
            )
          )}
      </Box>

      {dialogOpen && (
        <ConfigureNote mutate={mutate} onClose={() => setDialogOpen(false)} />
      )}
    </Container>
  );
}
