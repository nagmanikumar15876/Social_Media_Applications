import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  GOOGLE_LOGIN_REQUEST,
  GOOGLE_LOGIN_SUCCESS,
  GOOGLE_LOGIN_FAILURE,

  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,

  GET_PROFILE_REUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,

  LOGOUT,

  UPDATE_USER_REQUEST,
  UPDATE_USER_FAILURE,
  UPDATE_USER_SUCCESS,

  FIND_USER_BY_ID_FILURE,
  FIND_USER_BY_ID_REQUEST,
  FIND_USER_BY_ID_SUCCESS,

  FOLLOW_USER_FAILURE,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_REQUEST,

  SEARCH_USER_SUCCESS,
  SEARCH_USER_FAILURE,
  SEARCH_USER_REQUEST,

} from "./ActionType";


const initialState = {
  user: null,

  loading: false,

  error: null,

  /*
   * JWT is actually stored in localStorage.
   * This field can still hold it for Redux state,
   * but it is not the source of truth.
   */
  jwt: null,

  updateUser: false,

  searchResult: [],

  findUser: null,
};


const authReducer = (
  state = initialState,
  action
) => {

  switch (action.type) {

    // ==================================================
    // LOGIN REQUEST
    // ==================================================

    case LOGIN_REQUEST:

    case GOOGLE_LOGIN_REQUEST:

    case REGISTER_REQUEST:

    case GET_PROFILE_REUEST:

    case FIND_USER_BY_ID_REQUEST:

    case FOLLOW_USER_REQUEST:

      return {
        ...state,

        loading: true,

        error: null,
      };


    // ==================================================
    // SEARCH REQUEST
    // ==================================================

    case SEARCH_USER_REQUEST:

      return {
        ...state,

        searchResult: [],

        loading: true,

        error: null,
      };


    // ==================================================
    // UPDATE USER REQUEST
    // ==================================================

    case UPDATE_USER_REQUEST:

      return {
        ...state,

        loading: true,

        error: null,

        updateUser: false,
      };


    // ==================================================
    // LOGIN SUCCESS
    // ==================================================

    case LOGIN_SUCCESS:

      return {
        ...state,

        loading: false,

        error: null,

        /*
         * response.data from /auth/signin
         *
         * {
         *   jwt: "...",
         *   status: true
         * }
         */
        jwt: action.payload.jwt,

        /*
         * Keep user data if available.
         */
        user: action.payload.user || state.user,
      };


    // ==================================================
    // GOOGLE LOGIN SUCCESS
    // ==================================================

    case GOOGLE_LOGIN_SUCCESS:

      return {
        ...state,

        loading: false,

        error: null,

        jwt: action.payload.jwt,

        user:
          action.payload.user ||
          state.user,
      };


    // ==================================================
    // REGISTER SUCCESS
    // ==================================================

    case REGISTER_SUCCESS:

      /*
       * VERY IMPORTANT:
       *
       * Signup no longer returns JWT.
       *
       * It returns:
       *
       * "Registration successful.
       *  OTP sent..."
       *
       * Therefore DO NOT update jwt here.
       */

      return {
        ...state,

        loading: false,

        error: null,
      };


    // ==================================================
    // GET PROFILE SUCCESS
    // ==================================================

    case GET_PROFILE_SUCCESS:

      return {
        ...state,

        loading: false,

        error: null,

        user: action.payload,
      };


    // ==================================================
    // UPDATE USER SUCCESS
    // ==================================================

    case UPDATE_USER_SUCCESS:

      return {
        ...state,

        loading: false,

        error: null,

        user: action.payload,

        updateUser: true,
      };


    // ==================================================
    // FIND USER SUCCESS
    // ==================================================

    case FIND_USER_BY_ID_SUCCESS:

      return {
        ...state,

        loading: false,

        findUser: action.payload,

        error: null,
      };


    // ==================================================
    // SEARCH USER SUCCESS
    // ==================================================

    case SEARCH_USER_SUCCESS:

      return {
        ...state,

        loading: false,

        searchResult: action.payload,

        error: null,
      };


    // ==================================================
    // FOLLOW USER SUCCESS
    // ==================================================

    case FOLLOW_USER_SUCCESS:

      return {
        ...state,

        loading: false,

        findUser: action.payload,

        error: null,
      };


    // ==================================================
    // NORMAL LOGIN FAILURE
    // ==================================================

    case LOGIN_FAILURE:

    case GOOGLE_LOGIN_FAILURE:

    case REGISTER_FAILURE:

    case GET_PROFILE_FAILURE:

    case UPDATE_USER_FAILURE:

    case FIND_USER_BY_ID_FILURE:

    case FOLLOW_USER_FAILURE:

    case SEARCH_USER_FAILURE:

      return {
        ...state,

        loading: false,

        error: action.payload,
      };


    // ==================================================
    // LOGOUT
    // ==================================================

    case LOGOUT:

      return {
        ...initialState,
      };


    default:

      return state;
  }
};


export default authReducer;