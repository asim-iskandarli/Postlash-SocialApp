import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessagesDataType, MessageType } from "../../types";

interface IMessages {
  conversations: MessageType[];
  messages: MessagesDataType[];
}

const initialState: IMessages = {
  conversations: [],
  messages: [],
};

const postSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    getConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setMessages: (
      state: IMessages,
      action: PayloadAction<MessagesDataType>
    ) => {
      state.messages = [...state.messages, action.payload];
    },
    addMessage: (
      state: IMessages,
      action: PayloadAction<{
        newMessage: MessageType;
        conversation: MessageType;
      }>
    ) => {
      state.messages = [
        ...state.messages.map((data: any) =>
          data.user.id === action.payload.newMessage.senderId
            ? {
                ...data,
                messages: [...data.messages, action.payload.newMessage],
              }
            : {
                user: action.payload.newMessage.sender,
                messages: [action.payload.newMessage],
              }
        ),
      ];
      state.conversations = state.conversations.some(
        (c: MessageType) => c.id === action.payload.conversation.id
      )
        ? [
            ...state.conversations.map((c: MessageType) =>
              c.id === action.payload.conversation.id
                ? action.payload.conversation
                : c
            ),
          ]
        : [action.payload.conversation, ...state.conversations];

      console.log(state.conversations);
    },
    sendMessage: (
      state: IMessages,
      action: PayloadAction<{
        newMessage: MessageType;
        conversation: MessageType;
      }>
    ) => {
      state.messages = [
        ...state.messages.map((data: MessagesDataType) =>
          data.user?.id === action.payload.newMessage.receiverId
            ? {
                ...data,
                messages: [...data.messages, action.payload.newMessage],
              }
            : {
                user: action.payload.newMessage.receiver,
                messages: [action.payload.newMessage],
              }
        ),
      ];
      state.conversations = state.conversations.some(
        (c: MessageType) => c.id === action.payload.conversation.id
      )
        ? [
            ...state.conversations.map((c: MessageType) =>
              c.id === action.payload.conversation.id
                ? action.payload.conversation
                : c
            ),
          ]
        : [action.payload.conversation, ...state.conversations];
    },
  },
});

export const { getConversations, setMessages, addMessage, sendMessage } =
  postSlice.actions;

export default postSlice.reducer;
