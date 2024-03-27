# Documentation

Refer to [Contributing](/Contributing.md) to know how run this application.

## Introduction

To develop this application i used react typescript, react-router-dom and react-dom for navigation of the Single Page Application, react-hook-form as form handler used with the yup for its validation, axios to handle API calls, react-redux and @reduxjs/toolkit to handle the global state, crypto-js to handle crypting/decrypting of the redux state stored in the browser local storage,
material-ui for the components styling with react-perfect-scrollbar, and luxon to handle dates.

This application should answer to this requirements:

- Server simulate poor connectivity issues so application should be able to handle this condition
- If message is not delivered the system should ask to user to manually resend the message
- When the user presses the up key, the user should be able to edit their last message
- Edited messages should show an edited text display with date and time
- Users should be able to delete messages
- Deleted messages should be visible with a "Deleted by" message showing date and time
- Messages must be ordered by datetime
- On refreshing the page, messages should still remain on the page without reloading the whole list
- Users should be able to have multiple chats per browser tabs

## Code Structure

In the main folder you will find all the configurations/requirements files, the main focus should be on the src folder.

### Src

In the [types](/src/types.ts) file you will find almost every type of the application, this file is divided in 3 main section and an Utils section.

- DTO e BODY contain types that is needed for API comunication
- Redux State Store contain types of the redux store
- React-Hook-Forms form interfaces stores the interfaces of the forms handled by react-hook-form

### Api

Is where I created an axios instance and implemented all the frontend API calls to backend

### Controllers

This tsx files are called controlling components, their main functionality is to prapare the data for the components and handling their states.

- [Router](/src/Controllers/Router.tsx) control the login/logout state and redirect the user to the correct component of the single page application.
- [Home](/src/Controllers/Home.tsx) the main page of this single page application, control the states of the main page, this controller handles error page, loaders and renders the 3 main controllers: [Chat](/src/Controllers/Chat.tsx), [Header](/src/Controllers/Header.tsx) and [Threads](/src/Controllers/Threads.tsx)
- [Login](/src/Controllers/Login.tsx) the first page of this single page application, control the state of the user, this controller handles error page, loaders and renders the [Login Form](/src/Components/Login.tsx)
- [Chat](/src/Controllers/Chat.tsx) control and renders the state of [Chat Page](/src/Components/ChatPage.tsx) and renders the modal/pop up that handles the editing/deletion of the messages. This controller is in charge to connect the user with backend Web Socket (done via useEffect) and re-connect to the web socket (done via handleReSendMessage useCallback) when backend closes the connection after 1 minute.
- [MessageModal](/src/Controllers/MessageModal.tsx) is a secondary controller that helps [Chat](/src/Controllers/Chat.tsx) to handle message editing.
- [Header](/src/Controllers/Header.tsx) control and render user information (on [LeftHeader](/src/Components/LeftHeader.tsx)) and handles a second web socket connection that creates a fake user (on [RightHeader](/src/Components/RightHeader.tsx)) that, based on the active thread, will simulate message creation/editing/deletion in that chat by that user via a simple dropdown menu.
- [Threads](/src/Controllers/Threads.tsx) control and renders the state of [Thread List](/src/Components/ThreadList.tsx) and renders the modal/pop up that handles the creation/editing/deletion of the threads.

### Store

[Here](./src/Store/index.ts.ts) we setup and export the redux store, handle load/save state to local storage.

- [threads](./src/Store/threads.ts) here we handle the selectors, reducers and thunks of the [thread store](/src/Utils/store.ts#threadsInitialState) that mainly contain the thread and the message list, the message statuses and the active thread.
- [user](./src/Store/user.ts) here we handle the selectors, reducers and thunks of the [user store](/src/Utils/store.ts#userInitialState) that contains mainly user and fake user information
- [ws](./src/Store/ws.ts) is where we handle socket connection creation and gracefully close.

### Utils

In this folder you can find:

- [f](./src/Utils/f.ts) numerous [tested](./src/Utils/f.test.ts) utility functions.
- [ls](./src/Utils/ls.ts) handles the local storage interaction and its encrypt/decrypt.
- [store](./src/Utils/store.ts.ts) where we handle loading/saving state on page/reload and the initial state of the redux store.
- [config](./src/Utils/config.ts) environment variable loading from [env](/.env.example) file
- [obj](./src/Utils/obj.ts) a function that provides typed records util function.

and the jest tests.

### Components

All the components are pretty self-explicative mainly because their sole task is to render.
In the loom video I will explain all the UI details.

### Images

Is where the logo is stored (used for [favicon](./public/favicon.ico) and [Loader](/src/Components/Loader.tsx))

## Developed UX expectation

Here I will explain how I developed the [UX expectation](./README.md#movie_camera-ux-expectation) and the [bonus](./README.md#rocket-how-to-proceed) tip.

### Server simulate poor connectivity issues so application should be able to handle this condition

### (bonus) /messages/new have a special property checksum that you can use as custom identifier passing a value from the client

### If message is not delivered the system should ask to user to manually resend the message

The chat messages are sent via [POST](./src/Api/index.ts#sendMessage), so I used the `checksum` _[here a detailed explaination](#checksum)_ value that I send with that POST and, using the [Web Socket](./src/Store/ws.ts#setMessageStatuses) I set the message status with `checksum` value. If the Web Socket is active it will store 'sent' value in the [messageStatuses](./src/Utils/store.ts#threadsInitialState) property, otherwise when the user will load the message list it will show [failed](./src/Utils/f.ts#failed).
This portion of the state will not be deleted with the logout and it will be rehydratated via [local storage](<./src/Utils/store.ts#("archived")>).

The function that handles this behaviour is [handleReSendMessage](./src/Controllers/Chat.tsx#handleReSendMessage), it can be called only if the message is in failed status and it's handled graphically in [Message](./src/Components/Message.tsx#"failed") Component. Obviously the re-sent message functionality will only appear on messages that are written by the logged user.

### When the user presses the up key, the user should be able to edit their last message

I enhanced this request: you can edit any of your sent messages from message list. You will have a simple [Edit Icon](./src/Components/Message.tsx#EditOutlinedIcon) on the chat bubble to handle [this](./src/Controllers/MessageModal.tsx#onSubmit) on sumbit function.

### Edited messages should show an edited text display with date and time

Done [here](./src/Components/Message.tsx#Updated-at).

### Users should be able to delete messages

Done via this [ConfirmationDialog](./src/Controllers/Chat.tsx#ConfirmationDialog) and this function: [handleDeleteMessage](./src/Controllers/Chat.tsx#handleDeleteMessage).

### Deleted messages should be visible with a "Deleted by" message showing date and time

Done [here](./src/Components/Message.tsx#deletedAt).
\*See [Notes](#delete-messagesid)

### Messages must be ordered by datetime

Messages are already ordered, I have just reversed the order [here](./src/Components/MessageList.tsx#column-reverse), the thread list instead needed to be ordered, i sorted [here](./src/Utils/f.ts#sortThreadsByUpdatedAt).

### On refreshing the page, messages should still remain on the page without reloading the whole list

Done [here](./src/Utils/store.ts#loadState).

### Users should be able to have multiple chats per browser tabs

I used [this](./src/Controllers/Threads.tsx#onSubmitNewThread) to generate new threads from left menu list, and a [fake user](./src/Components/RightHeader.tsx#Hi) to fake message send/edit/delete the fake user will have the thread title as display name (it will appear on sent message too).

# Notes

Some notes on the backend implementation of this repository

## Types

- All the deletedAt values are not strings but rather `string | null`.
- Message property on `/threads` is not Message[] but it's not valorized.
- Max Length is not indicated _Ex. "text in `/message/:id` is 191 max length but it's not indicated."_

## API

### GET /threads

On Swagger we have a `message` field that is an array of messages, but this field is not valorized when calling the API, to obtain the `message` property, one must call `threads/:id`.
Generally speaking when there are 2 GETs:

- GET (general)
- GET (specific id)

You can do:

1. A list of ids (in general) and one with all information (on specific id)
2. Put all the information contained in the specific one on the general one too, otherwise the source of truth will be in two places and not in one.

### DELETE /messages/:id

This call delete the message instead of valorizing the 'Deleted At' date, thus [your rendering request](#deleted-messages-should-be-visible-with-a-deleted-by-message-showing-date-and-time) to handle Message Deleted on the frontend indicating its date is useless.

### DELETE /thread/:id

This call works only if all messages are deleted, and this is not indicated anywhere.
Backend returns an error message with a simple

```json
{ "errorCode": "AUTH_0500" }
```

### Web Socket

Web Socket could have handled better by the backend _Ex. "sending timed messages (just as you closed the Web Socket after 60 seconds) or in a finite number."_

This could improve the Web Socket management, using it more effectively Backend side, because the main question is: "Why do I have to make a POST to send a message if there's a Web Socket?"

### Swagger

I saw that you have fixed the Auth header, but there are still incorrect [types](#types) on the swagger.

I would also add brief descriptions of the API calls: _Ex. PATCH `/message/:id` and POST `/message/:id` do not indicate the maximum length (which I discovered to be 191)_ or indications about the `max length` of the `display name` and of `title` property of a thread.

### Checksum

I understood that you wanted me to use the `checksum` property to simulate reception of a message via WS by using its value as the display name of the user(s).

However, to do something different from others, I decided to simulate received messages, deletion and message editing by generating a [fake user](./src/Components/RightHeader.tsx#Hi) that has a different display name for each thread (based on its title).

To still use the WebSocket and the checksum property i did this way: `checksum` property sent by a user will be the [status](./src/types.ts#MessageStatus) of the messages. As said before failed status will trigger the re-send, which will reconnect the WebSocket.
