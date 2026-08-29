import { ButtonGroup, CardActions, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { WallItem } from "@/types/WallItem";

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
  return (
    <ButtonGroup sx={{ display: "flex", justifyContent: "flex-end", p: 0 }}>
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
    </ButtonGroup>
  );
}
