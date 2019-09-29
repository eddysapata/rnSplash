import { UI_START, UI_END } from "../actions/actionTypes";

const initialState = {
  isLoading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UI_START:
      return {
        ...state,
        isLoading: true
      }
    case UI_END:
      return{
        ...state,
        isLoading:false
      }
    default:
      return state;
  }
};

export default reducer;
