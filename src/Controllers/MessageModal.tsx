import { FC, useEffect } from "react";
import { SubmitHandler, Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editAMessage, getActiveThreadInfo } from "../Store/threads";
import { useAppDispatch } from "../Store";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import * as yup from "yup";

type MessageModalProps = {
  closeModal: () => void;
  schema: yup.ObjectSchema<ChatFormInputs>;
  activeThread: string;
  userId: string;
  messageToEdit?: string;
  defaultValue?: string;
};

const MessageModal: FC<MessageModalProps> = ({
  messageToEdit,
  schema,
  activeThread,
  userId,
  defaultValue,
  closeModal,
}) => {
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ChatFormInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!defaultValue) return;

    setValue("message", defaultValue);
  }, [defaultValue, setValue]);

  const onSubmit: SubmitHandler<ChatFormInputs> = async (data) => {
    if (!messageToEdit) return;

    await dispatch(
      editAMessage({ text: data.message, userId: userId, id: messageToEdit })
    );
    await dispatch(getActiveThreadInfo({ id: activeThread, userId: userId }));

    return closeModal();
  };

  return (
    <Modal
      open={Boolean(messageToEdit)}
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
          Edit Message
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="message"
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
              <>
                <TextField
                  {...field}
                  label="Message"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={Boolean(errors.message)}
                  helperText={errors.message?.message}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Edit
                </Button>
              </>
            )}
          />
        </form>
      </Box>
    </Modal>
  );
};

export default MessageModal;
