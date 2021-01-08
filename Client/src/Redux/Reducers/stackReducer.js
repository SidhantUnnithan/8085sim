import * as actionTypes from "../Actions/types";

// Intially stack is empty
const initialState = {
    stateStack: [],
};

export default function stack(state = initialState, action) {
    switch (action.type) {
        case actionTypes.STATE_STACK_CHANGE:
            return {
                ...state,
                stateStack: action.payload,
            };
        default:
            return state;
    }
}
