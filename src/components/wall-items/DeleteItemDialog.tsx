import { WallItemTypeValue } from "@/types/WallItem";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface DeleteDialogProps {
  type: WallItemTypeValue;
  title?: string;
  onClose: () => void;
  onDelete: () => void;
}
export default function DeleteItemDialog({
  type,
  title,
  onDelete,
  onClose,
}: DeleteDialogProps) {
  const dialogTitle = `Delete ${type}`;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    onDelete();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Are you sure you want to delete{" "}
          <span style={{ textTransform: "capitalize" }}>{type}</span>
          {title && (
            <span style={{ textTransform: "capitalize" }}>{`: ${title}`}</span>
          )}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="button"
          variant="contained"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          {isDeleting ? "Deleting" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
