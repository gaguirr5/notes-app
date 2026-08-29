"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useRef, useState } from "react";
import useUser from "@/hooks/useUser";
import {
  useTheme,
  useMediaQuery,
  IconButton,
  ButtonGroup,
  Tooltip,
  alpha,
} from "@mui/material";
import useWallItems from "@/hooks/useWallItems";
import { WallItemType } from "@/types/WallItem";
import ConfigureNote from "@/components/wall-items/notes/ConfigureNote";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DraggableNote from "@/components/wall-items/notes/DraggableNote";
import NoteItem from "@/components/wall-items/notes/NoteItem";
import { updateWallItem } from "@/lib/api/wall-items";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ChecklistIcon from "@mui/icons-material/Checklist";
import TaskIcon from "@mui/icons-material/Task";

export default function NotesPage() {
  const router = useRouter();
  const theme = useTheme();
  const wallRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: items, error, isLoading, mutate } = useWallItems();

  const { data: user } = useUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItemPosition, setNewItemPosition] = useState({ x: 0, y: 0 });
  const [openOptions, setOpenOptions] = useState(false);
  const mainOptionsColor = theme.custom.navBackground;

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

  const WALL_WIDTH = 1820;
  const WALL_HEIGHT = 1120;

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
      <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 6 } }}>
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontFamily: "var(--font-script)" }}>
            {displayName}
          </Typography>
          <ButtonGroup>
            <Tooltip title="Edit Wall Name">
              <IconButton sx={{ color: mainOptionsColor }} disabled>
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                borderRadius: "2rem",
                backgroundColor: openOptions
                  ? `${alpha(mainOptionsColor, 0.07)}`
                  : "",
              }}
            >
              <Tooltip title={openOptions ? "Close" : "Add item"}>
                <IconButton
                  sx={{ color: openOptions ? "" : "#38ad48" }}

                  onClick={() => setOpenOptions((prev) => !prev)}
                >
                  {openOptions ? <CloseIcon /> : <AddIcon />}
                </IconButton>
              </Tooltip>
              {openOptions && (
                <Box>
                  <Tooltip title="Add Note">
                    <IconButton
                      sx={{
                        color: openOptions ? "#f1c89c" : "",
                      }}
                      onClick={openCreateDialog}
                    >
                      <StickyNote2Icon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Add Checklist">
                    <IconButton
                      disabled
                      sx={{
                        color: openOptions ? "#90c5df" : "",
                      }}
                    >
                      <ChecklistIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Add Task">
                    <IconButton
                      disabled
                      sx={{
                        color: openOptions ? "#d5a9e7" : "",
                      }}
                    >
                      <TaskIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </ButtonGroup>
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
                border: `10px solid #483932`,
                backgroundColor: "#c89e7a",
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
