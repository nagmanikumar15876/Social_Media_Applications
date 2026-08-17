import axios from "axios";

export const API_BASE_URL =
    "http://localhost:5454";

export const api = axios.create({
    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json"
    }
});

/*
 * Before EVERY protected API request,
 * fetch the latest JWT from localStorage.
 */
api.interceptors.request.use(
    (config) => {

        const jwt =
            localStorage.getItem("jwt");

        /*
         * Don't keep an old Authorization header.
         */
        if (config.headers) {
            delete config.headers.Authorization;
        }

        /*
         * Add latest JWT if the user is logged in.
         */
        if (jwt) {

            config.headers.Authorization =
                `Bearer ${jwt}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);