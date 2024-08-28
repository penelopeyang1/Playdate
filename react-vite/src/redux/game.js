const LOAD_GAMES = "games/loadGames";
const UPDATE_GAME = "games/updateGame";
const DELETE_GAME = "games/deleteGame";

//action creators
const loadGames = (games) => ({
    type: LOAD_GAMES,
    payload: games,
});

const updateGame = (game) => ({
    type: UPDATE_GAME,
    payload: game,
});

const deleteGame = (gameId) => ({
    type: DELETE_GAME,
    payload: gameId,
});


//thunk actions
// export const thunkLoadGames = () => async (dispatch) => {
//     console.log('Fetching games...');
//     try {
//         const response = await fetch('/api/games/all');
//         console.log('Response status:', response.status);
//         if (response.ok) {
//             const games = await response.json();
//             dispatch(loadGames(games));
//         } else {
//             console.error('Failed to fetch games:', response.statusText);
//         }
//     } catch (error) {
//         console.error('Error fetching games:', error);
//     }
// };

export const thunkLoadGames = () => async (dispatch) => {
    try {
        const response = await fetch('/api/games/all');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        dispatch({
            type: 'LOAD_GAMES_SUCCESS',
            payload: data,
        });
    } catch (error) {
        console.error('Error fetching games:', error);
        dispatch({
            type: 'LOAD_GAMES_FAILURE',
            error: error.message,
        });
    }
};

export const thunkLoadUserGames = (userId) => async (dispatch) => {
    const response = await fetch(`/api/games/${userId}`);
    if (response.ok) {
        const games = await response.json();
        dispatch(loadGames(games));
    }
};

export const thunkUpdateGame = (gameId, updateData) => async (dispatch) => {
    const response = await fetch(`/api/games/${gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
    });
    if (response.ok) {
        const game = await response.json();
        dispatch(updateGame(game));
    }
};

export const thunkDeleteGame = (gameId) => async (dispatch) => {
    const response = await fetch(`/api/games/${gameId}`, {
        method: "DELETE",
    });
    if (response.ok) {
        dispatch(deleteGame(gameId));
    }
};

//reducer
const initialState = {};

export default function gamesReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_GAMES:
        // {
        //     // const newState = {};
        //     // action.payload.forEach((game) => {
        //     //     newState[game.id] = game;
        //     // });
        //     // return newState;
        // }
            return action.payload;
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
