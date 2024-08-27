const LOAD_MATCHES = "matches/loadMatches";
const CREATE_MATCH = "matches/createMatch";
const UPDATE_MATCH = "matches/updateMatch";
const DELETE_MATCH = "matches/deleteMatch";

//action creators
export const loadMatches = (matches) => ({
    type: LOAD_MATCHES,
    payload: matches,
});

export const createMatch = (match) => ({
    type: CREATE_MATCH,
    payload: match,
});

export const updateMatch = (match) => ({
    type: UPDATE_MATCH,
    payload: match,
});

export const deleteMatch = (matchId) => ({
    type: DELETE_MATCH,
    payload: matchId,
});

//thunk actions
export const thunkLoadMatches = () => async (dispatch) => {
    const response = await fetch("/api/matches/");
    if (response.ok) {
        const matches = await response.json();
        dispatch(loadMatches(matches));
    }
};

export const thunkCreateMatch = (matchData) => async (dispatch) => {
    const response = await fetch("/api/matches/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchData),
    });
    if (response.ok) {
        const match = await response.json();
        dispatch(createMatch(match));
    }
};

export const thunkUpdateMatch = (matchId, updateData) => async (dispatch) => {
    const response = await fetch(`/api/matches/${matchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
    });
    if (response.ok) {
        const match = await response.json();
        dispatch(updateMatch(match));
    }
};

export const thunkDeleteMatch = (matchId) => async (dispatch) => {
    const response = await fetch(`/api/matches/${matchId}`, {
        method: "DELETE",
    });
    if (response.ok) {
        dispatch(deleteMatch(matchId));
    }
};

//reducer
const initialState = {};

export default function matchesReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_MATCHES: {
            const newState = {};
            action.payload.forEach((match) => {
                newState[match.id] = match;
            });
            return newState;
        }
        case CREATE_MATCH:
            return { ...state, [action.payload.id]: action.payload };
        case UPDATE_MATCH:
            return { ...state, [action.payload.id]: action.payload };
        case DELETE_MATCH: {
            const newStateAfterDelete = { ...state };
            delete newStateAfterDelete[action.payload];
            return newStateAfterDelete;
        }
        default:
            return state;
    }
}
