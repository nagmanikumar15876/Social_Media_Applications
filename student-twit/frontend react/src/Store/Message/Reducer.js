import { ChatSharp } from "@mui/icons-material";
import * as actionType from "./ActionType";
import { LOGOUT } from "../Auth/ActionType";

const initialState = {
    messages: [],
    chats: [],
    loading: false,
    error: null,
    message:null
};


export const messageReducer = (state = initialState, action) => {

    switch (action.type) {
        case actionType.MOVE_CHAT_TO_TOP: {

            const chat = action.payload;

            return {
                ...state,
                chats: [
                    chat,
                    ...state.chats.filter(item => item.id !== chat.id)
                ]
            };
        }

        case actionType.CREATE_MESSAGE_SUCCESS:
            return { ...state, message: action.payload }

        case actionType.CREATE_CHAT_SUCCESS: {
                const chat = action.payload;

                // Remove existing occurrence of this chat
                const chatsWithoutCurrent = state.chats.filter(
                    item => item.id !== chat.id
                );

            // Put chat at the top
                return {
                ...state,
                chats: [chat, ...chatsWithoutCurrent]
                };
        }

        case actionType.GET_ALL_CHATS_SUCCESS: {

            const uniqueChats = action.payload.filter(
                (chat, index, self) =>
                    index === self.findIndex(c => c.id === chat.id)
            );

            return {
                ...state,
                chats: uniqueChats
            };
        }

        case LOGOUT:
            return initialState;

        default:
            return state;
    }
}
