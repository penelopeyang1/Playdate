const LOAD_MATCHES = "matches/loadMatches";
const CREATE_MATCH = "matches/createMatch";
const UPDATE_MATCH = "matches/updateMatch";
const DELETE_MATCH = "matches/deleteMatch";
const LOAD_POTENTIAL_MATCHES = "matches/loadPotentialMatches";
const CREATE_LIKE = "matches/createLike";
const CREATE_DISLIKE = "matches/createDislike";
const LOAD_USERS_LIKED_BY_ME = 'matches/loadUsersLikedByMe';

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

export const createLike = (like) => ({
    type: CREATE_LIKE,
    payload: like,
});

export const createDislike = (userId) => ({
    type: CREATE_DISLIKE,
    payload: userId,
});

export const loadUsersLikedByMe = (users) => ({
    type: LOAD_USERS_LIKED_BY_ME,
    payload: users,
});

//thunk actions
export const thunkLoadMatches = (userId) => async (dispatch) => {
    try {
        // Correct the endpoint path as per your backend configuration
        const response = await fetch(`/api/matches/matches?userId=${userId}`); // Adjust URL if necessary
        if (response.ok) {
            const matches = await response.json();
            console.log('Fetched Matches:', matches); // Debug log
            dispatch({ type: 'LOAD_USER_MATCHES', payload: matches });
        } else {
            console.error('Failed to fetch user matches:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching user matches:', error);
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
    try {
        const response = await fetch(`/api/matches/${matchId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log(`Match with ID ${matchId} deleted successfully.`);
            dispatch(deleteMatch(matchId));
        } else {
            const error = await response.json();
            console.error('Failed to delete match:', error.message);
        }
    } catch (error) {
        console.error('Error deleting match:', error);
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

// Thunks for Likes, Dislikes, and Matches
export const thunkCreateLike = (userId, likedUserId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/matches/like`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, likedUserId }),
        });
        if (response.ok) {
            const match = await response.json();
            if (match.status === 'matched') {
                console.log('Match Found:', match);
                dispatch(createMatch(match)); // Dispatch an action to update the match state
            } else {
                console.log('Like Created:', match);
                dispatch(createLike(match)); // Handle pending likes
            }
        }
    } catch (error) {
        console.error('Error creating like:', error);
    }
};

export const thunkCreateDislike = (userId, dislikedUserId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/matches/dislike`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, dislikedUserId }),
        });
        if (response.ok) {
            const dislike = await response.json();
            dispatch(createDislike(dislike)); // Update state to exclude disliked user
        }
    } catch (error) {
        console.error('Error creating dislike:', error);
    }
};

export const loadUsersWhoLikedMe = (userId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/matches/liked_me?userId=${userId}`);
        if (response.ok) {
            const likedUsers = await response.json();
            dispatch({ type: 'LOAD_LIKED_USERS', payload: likedUsers });
        } else {
            console.error('Failed to fetch users who liked me');
        }
    } catch (error) {
        console.error('Error fetching users who liked me:', error);
    }
};

export const loadUserMatches = (userId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/matches/matches?userId=${userId}`);
        if (response.ok) {
            const matches = await response.json();
            console.log('Fetched Matches:', matches); // Debug log
            dispatch({ type: 'LOAD_USER_MATCHES', payload: matches });
        } else {
            console.error('Failed to fetch user matches:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching user matches:', error);
    }
};

export const thunkLoadUsersLikedByMe = (userId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/matches/liked_by_me?userId=${userId}`);
        if (response.ok) {
            const users = await response.json();
            dispatch(loadUsersLikedByMe(users));
        } else {
            console.error('Failed to load users liked by me.');
        }
    } catch (error) {
        console.error('Error fetching users liked by me:', error);
    }
};

//reducer
const initialState = {
    matches: {},
    potentialMatches: [],
    likes: [],
    dislikes: [],
    likedUsers: [],
    usersLikedByMe: [],
};

export default function matchesReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_POTENTIAL_MATCHES:
            return {
                ...state,
                potentialMatches: action.payload.map(match => ({
                    ...match,
                    likedByCurrentUser: match.likedByCurrentUser, // Should be true/false
                    likedUserLikedBack: match.likedUserLikedBack  // Should be true/false
                }))
            };
        case LOAD_MATCHES: {
            const newState = { ...state, matches: {} };
            action.payload.forEach((match) => {
                newState.matches[match.id] = match;
            });
            return newState;
        }
        case CREATE_MATCH:
            return {
                ...state,
                matches: { ...state.matches, [action.payload.id]: action.payload },
                likedUsers: state.likedUsers.filter(user => user.id !== action.payload.id), // Optional: Remove from likedUsers if now matched
            };
        case UPDATE_MATCH:
            return { ...state, matches: { ...state.matches, [action.payload.id]: action.payload } };
        case DELETE_MATCH: {
            const newStateAfterDelete = { ...state, matches: { ...state.matches } };
            delete newStateAfterDelete.matches[action.payload];
            return newStateAfterDelete;
        }
        case CREATE_LIKE:
            return { ...state, likes: [...state.likes, action.payload] };
        case CREATE_DISLIKE:
            return {
                ...state,
                potentialMatches: state.potentialMatches.filter(
                    match => match.id !== action.payload
                ),
                dislikes: [...state.dislikes, action.payload],
            };
        case 'LOAD_LIKED_USERS':
            return { ...state, likedUsers: action.payload };
        case 'LOAD_USER_MATCHES': {
            const matchesObject = {};
            action.payload.forEach(match => {
                matchesObject[match.match.id] = { // Ensure correct data structure
                    match: match.match,
                    matched_user: match.matched_user
                };
            });
            console.log('Updated Matches State:', matchesObject); // Debug log
            return { ...state, matches: matchesObject };
        }
        case LOAD_USERS_LIKED_BY_ME:
            return { ...state, usersLikedByMe: action.payload };
        default:
            return state;
    }
}
