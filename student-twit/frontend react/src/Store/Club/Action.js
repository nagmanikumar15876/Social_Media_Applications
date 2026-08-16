import { api } from "../../Config/apiConfig"; // Adjust this path to wherever your axios instance is!
import * as actionType from "./ActionType";

export const getAllClubs = () => async (dispatch) => {
  dispatch({ type: actionType.GET_ALL_CLUBS_REQUEST });
  try {
    const { data } = await api.get("/api/clubs/all");
    dispatch({ type: actionType.GET_ALL_CLUBS_SUCCESS, payload: data });
  } catch (error) {
    console.log("Error fetching clubs:", error);
    dispatch({ type: actionType.GET_ALL_CLUBS_FAILURE, payload: error.message });
  }
};

export const getClubById = (clubId) => async (dispatch) => {
  dispatch({ type: actionType.GET_CLUB_BY_ID_REQUEST });
  try {
    const { data } = await api.get(`/api/clubs/${clubId}`);
    dispatch({ type: actionType.GET_CLUB_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    console.log("Error fetching club by ID:", error);
    dispatch({ type: actionType.GET_CLUB_BY_ID_FAILURE, payload: error.message });
  }
};

export const createClub = (clubData) => async (dispatch) => {
  dispatch({ type: actionType.CREATE_CLUB_REQUEST });
  try {
    const { data } = await api.post("/api/clubs/create", clubData);
    dispatch({ type: actionType.CREATE_CLUB_SUCCESS, payload: data });
  } catch (error) {
    console.log("Error creating club:", error);
    dispatch({ type: actionType.CREATE_CLUB_FAILURE, payload: error.message });
  }
};

export const updateClub = (clubId, clubData) => async (dispatch) => {
  dispatch({ type: actionType.UPDATE_CLUB_REQUEST });
  try {
    const { data } = await api.put(`/api/clubs/${clubId}/update`, clubData);
    dispatch({ type: actionType.UPDATE_CLUB_SUCCESS, payload: data });
  } catch (error) {
    console.log("Error updating club:", error);
    dispatch({ type: actionType.UPDATE_CLUB_FAILURE, payload: error.message });
  }
};

export const getClubEvents = (clubId) => async (dispatch) => {
  dispatch({ type: actionType.GET_CLUB_EVENTS_REQUEST });
  try {
    const { data } = await api.get(`/api/clubs/${clubId}/events`);
    dispatch({ type: actionType.GET_CLUB_EVENTS_SUCCESS, payload: data });
  } catch (error) {
    console.log("Error fetching events:", error);
    dispatch({ type: actionType.GET_CLUB_EVENTS_FAILURE, payload: error.message });
  }
};

export const createClubEvent = (eventData) => async (dispatch) => {
  dispatch({ type: actionType.CREATE_CLUB_EVENT_REQUEST });
  try {
    const { data } = await api.post("/api/clubs/events/create", eventData);
    dispatch({ type: actionType.CREATE_CLUB_EVENT_SUCCESS, payload: data });
  } catch (error) {
    console.log("Error creating event:", error);
    dispatch({ type: actionType.CREATE_CLUB_EVENT_FAILURE, payload: error.message });
  }
};

// Add this to your src/Store/Club/Action.js
export const deleteClub = (clubId) => async (dispatch) => {
  try {
    await api.delete(`/api/clubs/${clubId}/delete`);
    // Optional: Dispatch a success action to remove it from the Redux state
    alert("Club deleted successfully from database.");
  } catch (error) {
    console.log("Error deleting club:", error);
  }
};