import { FC } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type ConfirmDialogProps = {
  id: string;
  title?: string;
  dialogText?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  undo: () => void;
  confirm: () => void;
};

const ConfirmationDialog: FC<ConfirmDialogProps> = ({
  confirm,
  undo,
  id: id,
  title = "Confirm Action",
  dialogText = "Are you sure you want to perform this action?",
  cancelButtonText = "Cancel",
  confirmButtonText = "Confirm",
}) => (
  <Dialog open={Boolean(id)} onClose={undo}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{dialogText}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={undo} color="primary">
        {cancelButtonText}
      </Button>
      <Button onClick={confirm} color="primary">
        {confirmButtonText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationDialog;
