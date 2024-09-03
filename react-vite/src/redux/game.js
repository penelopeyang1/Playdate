const LOAD_ALL_GAMES = "games/loadAllGames";
const LOAD_USER_GAMES = "games/loadUserGames";
const ADD_GAME = "games/addGame";
const UPDATE_GAME = "games/updateGame";
const DELETE_GAME = "games/deleteGame";

//action creators
const loadAllGames = (games) => ({
    type: LOAD_ALL_GAMES,
    payload: games,
});

const loadUserGames = (games) => ({
    type: LOAD_USER_GAMES,
    payload: games,
});

const addGame = (game) => ({
    type: ADD_GAME,
    payload: game,
});

const updateGame = (game) => ({
    type: UPDATE_GAME,
    payload: game,
});

const deleteGame = (gameId) => ({
    type: DELETE_GAME,
    payload: gameId,
});

//thunk
export const thunkLoadAllGames = () => async (dispatch) => {
    try {
        const response = await fetch('/api/games/all');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched all games:', data);

        dispatch(loadAllGames(data));
    } catch (error) {
        console.error('Error fetching all games:', error);
        dispatch({
            type: 'LOAD_ALL_GAMES_FAILURE',
            error: error.message,
        });
    }
};

export const thunkAddGame = (userId, gameId) => async (dispatch) => {
    try {
        const response = await fetch('/api/games/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId, game_id: gameId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
        }

        const newGame = await response.json();
        dispatch(addGame(newGame));

        dispatch(thunkLoadUserGames(userId));
    } catch (error) {
        console.error('Failed to add game:', error);
    }
};

export const thunkLoadUserGames = (userId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/games/user/${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userGames = await response.json();
        console.log('Loaded user games:', userGames);
        dispatch(loadUserGames(userGames));
    } catch (error) {
        console.error('Error fetching user games:', error);
    }
};

export const thunkUpdateGame = (gameId, updateData) => async (dispatch) => {
    try {
        const response = await fetch(`/api/games/${gameId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });

        if (response.ok) {
            const game = await response.json();
            dispatch(updateGame(game));
        } else {
            console.error(`Failed to update game. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Failed to update game:', error);
    }
};

export const thunkDeleteGame = (userGameId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/games/${userGameId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            dispatch(deleteGame(userGameId)); // Use the primary key id
        } else {
            console.error(`Failed to delete game. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Failed to delete game:', error);
    }
};

//reducer
const initialState = {};

export default function gamesReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_ALL_GAMES: {
            const newState = {};
            action.payload.forEach(game => {
                newState[game.id] = game;
            });
            return newState;
        }
        case LOAD_USER_GAMES: {
            const newState = {};
            action.payload.forEach(game => {
                newState[game.id] = game;
            });
            return newState;
        }
        case ADD_GAME: {
            return { ...state, [action.payload.id]: action.payload };
        }
        case UPDATE_GAME:
            return { ...state, [action.payload.id]: action.payload };
        case DELETE_GAME: {
            const newStateAfterDelete = { ...state };
            delete newStateAfterDelete[action.payload];
            return newStateAfterDelete;
        }
        default:
            return state;
    }
}
