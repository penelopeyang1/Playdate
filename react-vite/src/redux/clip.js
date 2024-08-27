const LOAD_CLIPS = "clips/loadClips";
const CREATE_CLIP = "clips/createClip";
const UPDATE_CLIP = "clips/updateClip";
const DELETE_CLIP = "clips/deleteClip";

//action creators
const loadClips = (clips) => ({
    type: LOAD_CLIPS,
    payload: clips,
});

const createClip = (clip) => ({
    type: CREATE_CLIP,
    payload: clip,
});

const updateClip = (clip) => ({
    type: UPDATE_CLIP,
    payload: clip,
});

const deleteClip = (clipId) => ({
    type: DELETE_CLIP,
    payload: clipId,
});

//thunk actions
export const thunkLoadClips = (userId) => async (dispatch) => {
    const response = await fetch(`/api/clips/${userId}`);
    if (response.ok) {
        const clips = await response.json();
        dispatch(loadClips(clips));
    }
};

export const thunkCreateClip = (clipData) => async (dispatch) => {
    const response = await fetch("/api/clips/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clipData),
    });
    if (response.ok) {
        const clip = await response.json();
        dispatch(createClip(clip));
    }
};

export const thunkUpdateClip = (clipId, updateData) => async (dispatch) => {
    const response = await fetch(`/api/clips/${clipId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
    });
    if (response.ok) {
        const clip = await response.json();
        dispatch(updateClip(clip));
    }
};

export const thunkDeleteClip = (clipId) => async (dispatch) => {
    const response = await fetch(`/api/clips/${clipId}`, {
        method: "DELETE",
    });
    if (response.ok) {
        dispatch(deleteClip(clipId));
    }
};

//reducer
const initialState = {};

export default function clipsReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_CLIPS:
            return action.payload.reduce((acc, clip) => {
                acc[clip.id] = clip;
                return acc;
            }, {});
        case CREATE_CLIP:
        case UPDATE_CLIP:
            return { ...state, [action.payload.id]: action.payload };
        case DELETE_CLIP:
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        default:
            return state;
    }
}
