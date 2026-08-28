import { CardActions, IconButton } from "@mui/material";
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
    <CardActions>
      <IconButton onClick={() => onEdit(item)} size="small">
        <EditIcon fontSize="small" />
      </IconButton>

      <IconButton onClick={() => onDelete(item._id)} size="small">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </CardActions>
  );
}
