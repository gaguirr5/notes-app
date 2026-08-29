import { useState } from "react";
import { ButtonGroup, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { WallItem } from "@/types/WallItem";
import Close from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface ItemActionParams {
  item: WallItem;
  onEdit: (item: WallItem) => void;
  onDelete: (id: string) => void;
}

export default function ItemActions({
  item,
  onEdit,
  onDelete,
}: ItemActionParams) {
  const [open, setOpen] = useState(false);

  return (
    <ButtonGroup sx={{ display: "flex", justifyContent: "flex-end", p: 0 }}>
      <Tooltip title={open ? "Close" : "Settings"}>
        <IconButton onClick={() => setOpen((prev) => !prev)}>
          {open ? <Close /> : <MoreHorizIcon />}
        </IconButton>
      </Tooltip>
      {open && (
        <>
          <Tooltip title="Edit">
            <IconButton onClick={() => onEdit(item)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => onDelete(item._id)} size="small">
              <DeleteIcon
                fontSize="small"
                sx={(theme) => ({ color: theme.custom.delete })}
              />
            </IconButton>
          </Tooltip>
        </>
      )}
    </ButtonGroup>
  );
}
