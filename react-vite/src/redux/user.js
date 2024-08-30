const LOAD_USER_DETAILS = 'session/loadUserDetails';

const loadUserDetails = (user) => ({
    type: LOAD_USER_DETAILS,
    payload: user,
});

// export const thunkLoadUserDetails = (userId) => async (dispatch) => {
//     const response = await fetch(`/api/users/${userId}`);
//     if (response.ok) {
//         const userDetails = await response.json();
//         console.log('User Details:', userDetails);
//         dispatch(loadUserDetails(userDetails));
//     }
// };

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
        case LOAD_USER_DETAILS:
            return { ...state, [action.payload.id]: action.payload };
        default:
            return state;
    }
}
