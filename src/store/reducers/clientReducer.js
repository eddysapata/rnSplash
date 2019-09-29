import {
  ADD_CLIENT,
  DELETE_CLIENT,
  UPDATE_CLIENT,
  GET_ALL_CLIENT_LIST,
  GET_ALL_APPLICANT_LIST,
  CLIENT_DETAIL,
  LOGIN_USER,
  LOGOUT_USER,
  SIGNUP_USER,
  RESET_APP
} from "../actions/actionTypes";

const initialState = {
  user: {
    userID: "",
    name: "",
    image: "",
    emailAddress: "",
    isLoggedIn: false
  },
  clients: [],
  applicants: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user: {
          ...state.user,
          userID: action.userData.userID,
          name: action.userData.name,
          image: action.userData.image,
          emailAddress: action.userData.emailAddress,
          isLoggedIn: true
        }
      };
    case GET_ALL_APPLICANT_LIST:
      return {
        ...state,
        applicants: action.allApplicantList
      };
    case GET_ALL_CLIENT_LIST:
      return {
        ...state,
        clients: action.allClientList
      };
    case RESET_APP:
      return initialState;
    case LOGOUT_USER:
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: false
        }
      };
    default:
      return state;
  }
};

export default reducer;
