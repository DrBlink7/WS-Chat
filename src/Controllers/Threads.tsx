import { FC, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Store";
import { selectUser, setFakeUserDisplayName } from "../Store/user";
import {
  createNewThread,
  deleteAThread,
  editAThread,
  getActiveThreadInfo,
  getThreadList,
  selectActiveThread,
  selectThreads,
  setActiveThread,
} from "../Store/threads";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import Stack from "@mui/material/Stack";
import ThreadModal from "../Components/ThreadModal";
import ConfirmationDialog from "../Components/ConfirmationDialog";
import ThreadList from "../Components/ThreadList";
import * as obj from "../Utils/obj";
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup
    .string()
    .required("Thread title is required")
    .max(12, "Title is max 12 charachters"),
});

export const Threads: FC = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const threads = useAppSelector(selectThreads);
  const activeThread = useAppSelector(selectActiveThread);

  const [isCreateModalOpen, setCreateOpenModal] = useState<boolean>(false);
  const [threadToEdit, setEditOpenModal] = useState<string>("");
  const [threadToDelete, setDeleteDialogStatus] = useState<string>("");

  const changeActiveThread = useCallback(
    async (id: string) => {
      dispatch(setActiveThread(id));
      dispatch(setFakeUserDisplayName(obj.get<Thread>(threads, id).title));

      return await dispatch(getActiveThreadInfo({ id, userId: user.id }));
    },
    [dispatch]
  );

  const startNewThread = useCallback(() => setCreateOpenModal(true), []);

  const closeCreateModal = useCallback(() => {
    setCreateOpenModal(false);

    return reset();
  }, []);

  const editThisThread = useCallback((id: string) => setEditOpenModal(id), []);

  const closeEditModal = useCallback(() => {
    setEditOpenModal("");

    return reset();
  }, []);

  const handleThreadDelete = useCallback(async () => {
    if (!threadToDelete) return;

    await dispatch(deleteAThread({ userId: user.id, id: threadToDelete }));
    dispatch(setActiveThread(""));
    dispatch(setFakeUserDisplayName(""));
    await dispatch(getThreadList(user.id));

    return setDeleteDialogStatus("");
  }, [threadToDelete]);

  const showDeleteConfirmation = useCallback(
    (id: string) => setDeleteDialogStatus(id),
    []
  );

  const closeDeleteConfirmation = useCallback(
    () => setDeleteDialogStatus(""),
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ThreadFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmitNewThread: SubmitHandler<ThreadFormInputs> = async (data) => {
    try {
      const thread = await dispatch(
        createNewThread({ title: data.title, userId: user.id })
      );
      await dispatch(getThreadList(user.id));
      await dispatch(
        getActiveThreadInfo({
          id: (thread.payload as ThreadDTO).id,
          userId: user.id,
        })
      );
      setCreateOpenModal(false);

      return reset();
    } catch (e) {
      console.error(e); // We can move this to redux store if you prefer
    }
  };

  const onSubmitEditThread: SubmitHandler<ThreadFormInputs> = async (data) => {
    if (!threadToEdit) return;

    await dispatch(
      editAThread({ title: data.title, userId: user.id, id: threadToEdit })
    );
    await dispatch(getThreadList(user.id));
    setEditOpenModal("");

    return reset();
  };

  return (
    <Stack display="flex" width="25%">
      <ConfirmationDialog
        confirm={handleThreadDelete}
        undo={closeDeleteConfirmation}
        id={threadToDelete}
        cancelButtonText="undo"
        confirmButtonText="delete"
        title="Delete Thread"
        dialogText="Are you sure you want to delete this thread?"
      />
      <ThreadModal
        closeModal={closeCreateModal}
        handleSubmit={handleSubmit}
        onSubmit={onSubmitNewThread}
        isModalOpen={isCreateModalOpen}
        control={control}
        errors={errors}
      />
      <ThreadModal
        closeModal={closeEditModal}
        handleSubmit={handleSubmit}
        onSubmit={onSubmitEditThread}
        isModalOpen={Boolean(threadToEdit)}
        control={control}
        errors={errors}
        submit="Edit"
        title="Edit This Thread"
        defaultValue={obj.get<Thread>(threads, threadToEdit).title}
      />
      <ThreadList
        activeThread={activeThread}
        threads={threads}
        startNewThread={startNewThread}
        changeActiveThread={changeActiveThread}
        editThisThread={editThisThread}
        showDeleteConfirmation={showDeleteConfirmation}
      />
    </Stack>
  );
};

export default Threads;
