// authActions.js

import axios from "axios";

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,

  GET_PROFILE_REUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,

  LOGOUT,

  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,

  FIND_USER_BY_ID_REQUEST,
  FIND_USER_BY_ID_FILURE,
  FIND_USER_BY_ID_SUCCESS,

  GOOGLE_LOGIN_REQUEST,
  GOOGLE_LOGIN_SUCCESS,
  GOOGLE_LOGIN_FAILURE,

  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE,

  SEARCH_USER_REQUEST,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_FAILURE,

} from "./ActionType";

import {
  API_BASE_URL,
  api
} from "../../Config/apiConfig";

// =======================================================
// LOGIN
// =======================================================

export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const loginUser =
  (loginData) => async (dispatch) => {

    dispatch(loginRequest());

    try {

      const response = await axios.post(
        `${API_BASE_URL}/auth/signin`,
        loginData
      );

      const user = response.data;

      console.log("login user -:", user);

      /*
       * JWT is created by backend after successful login.
       * Store it here.
       */
      if (user.jwt) {

        localStorage.setItem(
          "jwt",
          user.jwt
        );
      }

      dispatch(
        loginSuccess(user)
      );

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An error occurred during login.";

      dispatch(
        loginFailure(message)
      );
    }
  };


// =======================================================
// GOOGLE LOGIN
// =======================================================

export const loginWithGoogleAction =
  (data) => async (dispatch) => {

    dispatch({
      type: GOOGLE_LOGIN_REQUEST,
    });

    try {

      const response = await axios.post(
        `${API_BASE_URL}/auth/signin/google`,
        data
      );

      const user = response.data;

      console.log(
        "login with google user -:",
        user
      );

      /*
       * Google authentication also returns JWT.
       */
      if (user.jwt) {

        localStorage.setItem(
          "jwt",
          user.jwt
        );
      }

      dispatch({
        type: GOOGLE_LOGIN_SUCCESS,
        payload: user,
      });

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An error occurred during Google login.";

      dispatch({
        type: GOOGLE_LOGIN_FAILURE,
        payload: message,
      });
    }
  };


// =======================================================
// REGISTER
// =======================================================

export const registerRequest = () => ({
  type: REGISTER_REQUEST,
});

export const registerSuccess = (message) => ({
  type: REGISTER_SUCCESS,
  payload: message,
});

export const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  payload: error,
});

export const registerUser =
  (userData) => async (dispatch) => {

    dispatch(registerRequest());

    try {

      /*
       * IMPORTANT:
       * Signup is a public endpoint.
       *
       * Use plain axios.
       * Do NOT use api here because signup does not
       * need JWT authentication.
       */
      const response = await axios.post(
        `${API_BASE_URL}/auth/signup`,
        userData
      );

      const message =
        typeof response.data === "string"
          ? response.data
          : response.data?.message ||
            "Registration successful.";

      /*
       * IMPORTANT:
       * No JWT is stored here.
       *
       * User must:
       * Signup → OTP → Verify → Signin → JWT
       */
      dispatch(
        registerSuccess(message)
      );

      return {
        success: true,
        message,
      };

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Registration failed.";

      dispatch(
        registerFailure(message)
      );

      return {
        success: false,
        message,
      };
    }
  };


// =======================================================
// GET PROFILE
// =======================================================

const getUserProfileRequest = () => ({
  type: GET_PROFILE_REUEST,
});

const getUserProfileSuccess = (user) => ({
  type: GET_PROFILE_SUCCESS,
  payload: user,
});

const getUserProfileFailure = (error) => ({
  type: GET_PROFILE_FAILURE,
  payload: error,
});


export const getUserProfile =
  () => async (dispatch) => {

    dispatch(
      getUserProfileRequest()
    );

    try {

      /*
       * IMPORTANT:
       * Use `api`, not axios.
       *
       * apiConfig.js interceptor automatically reads
       * the latest JWT from localStorage and adds:
       *
       * Authorization: Bearer <JWT>
       */
      const response = await api.get(
        "/api/users/profile"
      );

      const user = response.data;

      console.log(
        "profile user -:",
        user
      );

      dispatch(
        getUserProfileSuccess(user)
      );

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An error occurred while fetching profile.";

      dispatch(
        getUserProfileFailure(message)
      );
    }
  };


// =======================================================
// FIND USER BY ID
// =======================================================

export const findUserById =
  (userId) => async (dispatch) => {

    dispatch({
      type: FIND_USER_BY_ID_REQUEST,
    });

    try {

      const response = await api.get(
        `/api/users/${userId}`
      );

      const user = response.data;

      console.log(
        "find by id user -:",
        user
      );

      dispatch({
        type: FIND_USER_BY_ID_SUCCESS,
        payload: user,
      });

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message;

      dispatch({
        type: FIND_USER_BY_ID_FILURE,
        error: message,
      });
    }
  };


// =======================================================
// SEARCH USER
// =======================================================

export const searchUser =
  (query) => async (dispatch) => {

    dispatch({
      type: SEARCH_USER_REQUEST,
    });

    try {

      const response = await api.get(
        `/api/users/search?query=${encodeURIComponent(query)}`
      );

      const users = response.data;

      console.log(
        "search result -:",
        users
      );

      dispatch({
        type: SEARCH_USER_SUCCESS,
        payload: users,
      });

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message;

      dispatch({
        type: SEARCH_USER_FAILURE,
        error: message,
      });
    }
  };


// =======================================================
// UPDATE PROFILE
// =======================================================

export const updateUserProfile =
  (reqData) => async (dispatch) => {

    console.log(
      "update profile reqData",
      reqData
    );

    dispatch({
      type: UPDATE_USER_REQUEST,
    });

    try {

      const response = await api.put(
        "/api/users/update",
        reqData
      );

      const user = response.data;

      console.log(
        "updated user -:",
        user
      );

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: user,
      });

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message;

      dispatch({
        type: UPDATE_USER_FAILURE,
        payload: message,
      });
    }
  };


// =======================================================
// FOLLOW USER
// =======================================================

export const FollowUserAction =
  (userId) => async (dispatch) => {

    dispatch({
      type: FOLLOW_USER_REQUEST,
    });

    try {

      const response = await api.put(
        `/api/users/${userId}/follow`
      );

      const user = response.data;

      console.log(
        "follow user -:",
        user
      );

      dispatch({
        type: FOLLOW_USER_SUCCESS,
        payload: user,
      });

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message;

      dispatch({
        type: FOLLOW_USER_FAILURE,
        payload: message,
      });
    }
  };


// =======================================================
// LOGOUT
// =======================================================

export const logout =
  () => (dispatch) => {

    localStorage.removeItem(
      "jwt"
    );

    localStorage.removeItem(
      "verificationEmail"
    );

    dispatch({
      type: LOGOUT,
      payload: null,
    });
  };