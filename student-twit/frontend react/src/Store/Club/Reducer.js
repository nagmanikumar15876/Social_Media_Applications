import * as actionType from "./ActionType";

const initialState = {
  loading: false,
  error: null,
  clubs: [],         // Holds the list of all clubs
  club: null,        // Holds the single club currently being viewed
  events: [],        // Holds the events for the currently viewed club
};

export const clubReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.GET_ALL_CLUBS_REQUEST:
    case actionType.GET_CLUB_BY_ID_REQUEST:
    case actionType.CREATE_CLUB_REQUEST:
    case actionType.UPDATE_CLUB_REQUEST:
    case actionType.GET_CLUB_EVENTS_REQUEST:
    case actionType.CREATE_CLUB_EVENT_REQUEST:
      return { ...state, loading: true, error: null };

    case actionType.GET_ALL_CLUBS_SUCCESS:
      return { ...state, loading: false, clubs: action.payload };

    case actionType.GET_CLUB_BY_ID_SUCCESS:
      return { ...state, loading: false, club: action.payload };

    case actionType.CREATE_CLUB_SUCCESS:
      return { ...state, loading: false, clubs: [...state.clubs, action.payload] };

    case actionType.UPDATE_CLUB_SUCCESS:
      return { ...state, loading: false, club: action.payload };

    case actionType.GET_CLUB_EVENTS_SUCCESS:
      return { ...state, loading: false, events: action.payload };

    case actionType.CREATE_CLUB_EVENT_SUCCESS:
      return { ...state, loading: false, events: [...state.events, action.payload] };

    case actionType.GET_ALL_CLUBS_FAILURE:
    case actionType.GET_CLUB_BY_ID_FAILURE:
    case actionType.CREATE_CLUB_FAILURE:
    case actionType.UPDATE_CLUB_FAILURE:
    case actionType.GET_CLUB_EVENTS_FAILURE:
    case actionType.CREATE_CLUB_EVENT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};