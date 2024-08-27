const LOAD_MESSAGES = "messages/loadMessages";
const CREATE_MESSAGE = "messages/createMessage";
const UPDATE_MESSAGE = "messages/updateMessage";
const DELETE_MESSAGE = "messages/deleteMessage";

//action creators
export const loadMessages = (messages) => ({
    type: LOAD_MESSAGES,
    payload: messages,
});

export const createMessage = (message) => ({
    type: CREATE_MESSAGE,
    payload: message,
});

export const updateMessage = (message) => ({
    type: UPDATE_MESSAGE,
    payload: message,
});

export const deleteMessage = (messageId) => ({
    type: DELETE_MESSAGE,
    payload: messageId,
});

//thunk actions
export const thunkLoadMessages = (chatId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/messages/${chatId}`);
        if (response.ok) {
            const messages = await response.json();
            dispatch(loadMessages(messages));
        }
    } catch (err) {
        console.error("Failed to load messages:", err);
    }
};

export const thunkCreateMessage = (messageData) => async (dispatch) => {
    try {
        const response = await fetch("/api/messages/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(messageData),
        });
        if (response.ok) {
            const message = await response.json();
            dispatch(createMessage(message));
        } else if (response.status < 500) {
            const errorMessages = await response.json();
            return errorMessages;
        } else {
            return { server: "Something went wrong. Please try again" };
        }
    } catch (err) {
        console.error("Failed to create message:", err);
    }
};

export const thunkUpdateMessage = (messageId, updateData) => async (dispatch) => {
    try {
        const response = await fetch(`/api/messages/${messageId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });
        if (response.ok) {
            const message = await response.json();
            dispatch(updateMessage(message));
        } else if (response.status < 500) {
            const errorMessages = await response.json();
            return errorMessages;
        } else {
            return { server: "Something went wrong. Please try again" };
        }
    } catch (err) {
        console.error("Failed to update message:", err);
    }
};

export const thunkDeleteMessage = (messageId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/messages/${messageId}`, {
            method: "DELETE",
        });
        if (response.ok) {
            dispatch(deleteMessage(messageId));
        } else if (response.status < 500) {
            const errorMessages = await response.json();
            return errorMessages;
        } else {
            return { server: "Something went wrong. Please try again" };
        }
    } catch (err) {
        console.error("Failed to delete message:", err);
    }
};

//reducer
const initialState = {};

export default function messagesReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_MESSAGES: {
            const newState = {};
            action.payload.forEach((message) => {
                newState[message.id] = message;
            });
            return newState;
        }
        case CREATE_MESSAGE:
            return { ...state, [action.payload.id]: action.payload };
        case UPDATE_MESSAGE:
            return { ...state, [action.payload.id]: action.payload };
        case DELETE_MESSAGE: {
            const newStateAfterDelete = { ...state };
            delete newStateAfterDelete[action.payload];
            return newStateAfterDelete;
        }
        default:
            return state;
    }
}
