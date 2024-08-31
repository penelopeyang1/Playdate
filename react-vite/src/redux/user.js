const LOAD_ALL_USERS = 'users/loadAllUsers';
const LOAD_USER_DETAILS = 'users/loadUserDetails';

const loadAllUsers = (users) => ({
    type: LOAD_ALL_USERS,
    payload: users,
});

const loadUserDetails = (user) => ({
    type: LOAD_USER_DETAILS,
    payload: user,
});

export const thunkLoadAllUsers = () => async (dispatch) => {
    try {
        const response = await fetch('/api/users');  // Assuming your API endpoint returns all users

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const users = await response.json();
        dispatch(loadAllUsers(users));
    } catch (error) {
        console.error('Error fetching all users:', error);
    }
};

export const thunkLoadUserDetails = (userId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const user = await response.json();
        dispatch(loadUserDetails(user));
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
};

const initialState = {};

export default function usersReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_ALL_USERS:
            const newState = {};
            action.payload.forEach(user => {
                newState[user.id] = user;
            });
            return { ...state, ...newState };
        case LOAD_USER_DETAILS:
            return { ...state, [action.payload.id]: action.payload };
        default:
            return state;
    }
}
