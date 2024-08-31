const LOAD_MATCHES = "matches/loadMatches";
const CREATE_MATCH = "matches/createMatch";
const UPDATE_MATCH = "matches/updateMatch";
const DELETE_MATCH = "matches/deleteMatch";
const LOAD_POTENTIAL_MATCHES = "matches/loadPotentialMatches";

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

export const loadPotentialMatches = (matches) => ({
    type: LOAD_POTENTIAL_MATCHES,
    payload: matches,
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

export const thunkLoadPotentialMatches = (userId) => async (dispatch) => {
    const response = await fetch(`/api/matches/potential_matches?userId=${userId}`);
    if (response.ok) {
        const potentialMatches = await response.json();
        dispatch(loadPotentialMatches(potentialMatches));
    } else {
        console.error('Failed to fetch potential matches');
    }
};

//reducer
const initialState = {
    matches: {},
    potentialMatches: [],
};

export default function matchesReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_POTENTIAL_MATCHES:
            return { ...state, potentialMatches: action.payload };
        case LOAD_MATCHES: {
            const newState = { ...state, matches: {} };
            action.payload.forEach((match) => {
                newState.matches[match.id] = match;
            });
            return newState;
        }
        case CREATE_MATCH:
            return { ...state, matches: { ...state.matches, [action.payload.id]: action.payload } };
        case UPDATE_MATCH:
            return { ...state, matches: { ...state.matches, [action.payload.id]: action.payload } };
        case DELETE_MATCH: {
            const newStateAfterDelete = { ...state, matches: { ...state.matches } };
            delete newStateAfterDelete.matches[action.payload];
            return newStateAfterDelete;
        }
        default:
            return state;
    }
}
