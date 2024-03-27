import { FC } from "react";
import {
  SubmitHandler,
  Controller,
  Control,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

type ThreadModalProps = {
  isModalOpen: boolean;
  control: Control<ThreadFormInputs>;
  errors: FieldErrors<ThreadFormInputs>;
  defaultValue?: string;
  title?: string;
  submit?: string;
  closeModal: () => void;
  handleSubmit: UseFormHandleSubmit<ThreadFormInputs>;
  onSubmit: SubmitHandler<ThreadFormInputs>;
};

const ThreadModal: FC<ThreadModalProps> = ({
  isModalOpen,
  control,
  errors,
  title = "Create New Thread",
  submit = "Create",
  defaultValue = "",
  handleSubmit,
  closeModal,
  onSubmit,
}) => (
  <Modal
    open={isModalOpen}
    onClose={closeModal}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {title}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                label="Title"
                variant="outlined"
                margin="normal"
                fullWidth
                error={Boolean(errors.title)}
                helperText={errors.title?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {submit}
              </Button>
            </>
          )}
        />
      </form>
    </Box>
  </Modal>
);

export default ThreadModal;
