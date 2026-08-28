"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useRef, useState } from "react";
import useUser from "@/hooks/useUser";
import { useTheme, useMediaQuery } from "@mui/material";
import useWallItems from "@/hooks/useWallItems";
import { WallItemType } from "@/types/WallItem";
import ConfigureNote from "@/components/WallItems/Notes/ConfigureNote";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DraggableNote from "@/components/WallItems/Notes/DraggableNote";
import NoteItem from "@/components/WallItems/Notes/NoteItem";
import { updateWallItem } from "@/lib/api/wall-items";
import { restrictToParentElement } from "@dnd-kit/modifiers";

export default function NotesPage() {
  const router = useRouter();
  const theme = useTheme();
  const wallRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: items, error, isLoading, mutate } = useWallItems();

  const { data: user } = useUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItemPosition, setNewItemPosition] = useState({ x: 0, y: 0 });

  // Requires the pointer to move at least 8px before a drag actually
  // starts. Without this, dnd-kit treats every pointerdown as a
  // potential drag and swallows clicks meant for nested buttons
  // (Edit/Delete), even a plain click with no real movement.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (error) {
    router.push("/login");
    return null;
  }

  const itemsFound = !!items && items.length > 0;
  const displayName = user ? `${user.displayName}'s Wall` : "My Wall";

  const WALL_WIDTH = 1802;
  const WALL_HEIGHT = 1102;

  const getNewItemPosition = () => {
    if (!wallRef.current) return { x: 0, y: 0 };

    const { scrollLeft, scrollTop, clientWidth, clientHeight } =
      wallRef.current;
    const centerX = scrollLeft + clientWidth / 2;
    const centerY = scrollTop + clientHeight / 2;

    const jitterX = (Math.random() - 0.5) * 100;
    const jitterY = (Math.random() - 0.5) * 100;

    return {
      x: Math.max(0, centerX + jitterX - 140),
      y: Math.max(0, centerY + jitterY - 65),
    };
  };

  const openCreateDialog = () => {
    setNewItemPosition(getNewItemPosition());
    setDialogOpen(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, delta } = event;
    const item = items?.find((n) => n._id === active.id);
    if (!item || !wallRef.current) return;

    const wallRect = wallRef.current.getBoundingClientRect();
    const draggedElement = document.querySelector(
      `[data-item-id="${active.id}"]`
    ) as HTMLElement;
    const itemWidth = draggedElement?.offsetWidth ?? 280;
    const itemHeight = draggedElement?.offsetHeight ?? 231;

    const rawX = item.x + delta.x;
    const rawY = item.y + delta.y;

    const newX = Math.max(0, Math.min(rawX, wallRect.width - itemWidth));
    const newY = Math.max(0, Math.min(rawY, wallRect.height - itemHeight));

    mutate(
      items?.map((n) => (n._id === item._id ? { ...n, x: newX, y: newY } : n)),
      false
    );

    await updateWallItem(item._id, { x: newX, y: newY });
    mutate();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
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
              "&:hover": { opacity: 0.85 },
            }}
          >
            New Note
          </Button>
        </Box>

        {!itemsFound && <Typography>No items yet.</Typography>}

        {itemsFound && isMobile && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {items.map((item) =>
              item.type === WallItemType.Note ? (
                <NoteItem key={item._id} data={item} mutate={mutate} />
              ) : null
            )}
          </Box>
        )}

        {dialogOpen && (
          <ConfigureNote
            mutate={mutate}
            position={newItemPosition}
            onClose={() => setDialogOpen(false)}
          />
        )}
      </Container>
      {itemsFound && !isMobile && (
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToParentElement]}
            autoScroll={false}
          >
            <Box
              ref={wallRef}
              sx={{
                position: "relative",
                width: WALL_WIDTH,
                height: WALL_HEIGHT,
                overflow: "auto",
                border: "1px dashed",
                borderColor: "divider",
              }}
            >
              {items.map((item) =>
                item.type === WallItemType.Note ? (
                  <DraggableNote key={item._id} item={item} mutate={mutate} />
                ) : null
              )}
            </Box>
          </DndContext>
        </Box>
      )}
    </>
  );
}
