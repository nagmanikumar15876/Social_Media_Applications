import { api } from "../../Config/apiConfig";
import * as types from "./ActionType";

export const getBranches = () => async (dispatch) => {
    try {
        const { data } = await api.get("/api/education/branches");
        dispatch({ type: types.GET_BRANCHES_SUCCESS, payload: data });
    } catch (error) {
        console.error("Error getting branches", error);
    }
};

export const getSemesters = (branchId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/education/branches/${branchId}/semesters`);
        dispatch({ type: types.GET_SEMESTERS_SUCCESS, payload: data });
    } catch (error) {
        console.error("Error getting semesters", error);
    }
};

export const getSubjects = (semesterId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/education/semesters/${semesterId}/subjects`);
        dispatch({ type: types.GET_SUBJECTS_SUCCESS, payload: data });
    } catch (error) {
        console.error("Error getting subjects", error);
    }
};

export const getResources = (subjectId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/education/subjects/${subjectId}/resources`);
        dispatch({ type: types.GET_APPROVED_RESOURCES_SUCCESS, payload: data });
    } catch (error) {
        console.error("Error getting resources", error);
    }
};

export const submitResource = (subjectId, resourceData) => async () => {
    try {
        await api.post(`/api/education/subjects/${subjectId}/resources/submit`, resourceData);
        alert("Resource submitted successfully! It is now pending admin review.");
    } catch (error) {
        console.error("Error submitting resource", error);
        alert("Failed to submit resource. Please try again.");
    }
};

// Admin Actions
export const getPendingResources = () => async (dispatch) => {
    try {
        const { data } = await api.get("/api/admin/education/resources/pending");
        dispatch({ type: types.GET_PENDING_RESOURCES_SUCCESS, payload: data });
    } catch (error) {
        console.error("Error getting pending resources", error);
    }
};

export const approveResource = (resourceId) => async (dispatch) => {
    try {
        await api.put(`/api/admin/education/resources/${resourceId}/approve`);
        dispatch(getPendingResources());
    } catch (error) {
        console.error("Error approving resource", error);
    }
};

export const rejectResource = (resourceId) => async (dispatch) => {
    try {
        await api.put(`/api/admin/education/resources/${resourceId}/reject`);
        dispatch(getPendingResources());
    } catch (error) {
        console.error("Error rejecting resource", error);
    }
};

export const deleteResource = (resourceId, subjectId) => async (dispatch) => {
    try {
        await api.delete(`/api/admin/education/resources/${resourceId}`);
        dispatch(getResources(subjectId));
    } catch (error) {
        console.error("Error deleting resource", error);
    }
};