import * as types from "./ActionType";

const initialState = {
    branches: [],
    semesters: [],
    subjects: [],
    resources: [],
    pendingResources: []
};

export const educationReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_BRANCHES_SUCCESS:
            return { ...state, branches: action.payload };
        case types.GET_SEMESTERS_SUCCESS:
            return { ...state, semesters: action.payload };
        case types.GET_SUBJECTS_SUCCESS:
            return { ...state, subjects: action.payload };
        case types.GET_APPROVED_RESOURCES_SUCCESS:
            return { ...state, resources: action.payload };
        case types.GET_PENDING_RESOURCES_SUCCESS:
            return { ...state, pendingResources: action.payload };
        default:
            return state;
    }
};