import { AxiosResponse } from "axios";
import { authorization } from "../Utils/config";
import axiosClient from "./axios";

export const authenticateEmail = async (
  email: string
): Promise<AxiosResponse<AuthenticateDTO>> => {
  const body: AuthenticateBody = { email: email };
  return axiosClient.post(`/users/authenticate`, { ...body });
};

export const sendMessage = async (
  userId: string,
  text: string,
  threadId: string,
  displayName: string,
  checkSum: MessageStatus
): Promise<AxiosResponse<SendMessageDTO>> => {
  const config = {
    headers: {
      [authorization]: `${userId}`,
    },
  };
  const body: SendMessageBody = { checkSum, displayName, text, threadId };
  return axiosClient.post(`/messages/new`, { ...body }, config);
};

export const editMessage = async (
  userId: string,
  id: string,
  text: string
): Promise<AxiosResponse<EditMessageDTO>> => {
  const config = {
    headers: {
      [authorization]: `${userId}`,
    },
  };
  const body: EditMessageBody = { text };
  return axiosClient.patch(`/messages/${id}`, { ...body }, config);
};

export const deleteMessage = async (
  userId: string,
  id: string
): Promise<AxiosResponse<DeleteMessageDTO>> => {
  const config = {
    headers: {
      [authorization]: `${userId}`,
    },
  };
  return axiosClient.delete(`/messages/${id}`, config);
};

export const createThread = async (
  userId: string,
  title: string
): Promise<AxiosResponse<CreateThreadDTO>> => {
  const config = {
    headers: {
      [authorization]: `${userId}`,
    },
  };
  const body: CreateThreadBody = { title };
  return axiosClient.post(`/threads/new`, { ...body }, config);
};

export const getThreads = async (
  userId: string
): Promise<AxiosResponse<GetThreadsDTO>> => {
  const config = {
    headers: {
      [authorization]: `${userId}`,
    },
  };

  return axiosClient.get(`/threads`, config);
};

export const getThread = async (
  id: string,
  userId: string
): Promise<AxiosResponse<GetThreadDTO>> => {
  const config = {
    headers: {
      [authorization]: `${userId}`,
    },
  };
  return axiosClient.get(`/threads/${id}`, config);
};

export const editThread = async (
  id: string,
  title: string,
  userId: string
): Promise<AxiosResponse<EditThreadDTO>> => {
  const config = {
    headers: {
      [authorization]: `${userId}`,
    },
  };
  const body: EditThreadBody = { title };
  return axiosClient.patch(`/threads/${id}`, { ...body }, config);
};

export const deleteThread = async (
  id: string,
  userId: string
): Promise<AxiosResponse<DeleteThreadDTO>> => {
  const config = {
    headers: {
      [authorization]: `${userId}`,
    },
  };

  return axiosClient.delete(`/threads/${id}`, config);
};
