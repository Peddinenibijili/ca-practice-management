import axios from "axios";

const api = axios.create({

    baseURL: "http://localhost:5000/api",

    headers: {
        "Content-Type": "application/json"
    }

});


// =====================================================
// ADD JWT TO EVERY REQUEST
// =====================================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");

        console.log(
            "API REQUEST:",
            config.method?.toUpperCase(),
            config.url
        );

        console.log(
            "TOKEN EXISTS:",
            !!token
        );

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


// =====================================================
// HANDLE API ERRORS
// =====================================================

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        console.error(
            "API ERROR:",
            error.response?.status,
            error.response?.data
        );


        if (
            error.response?.status === 401 ||
            error.response?.status === 403
        ) {

            console.error(
                "AUTH ERROR:",
                error.response?.data
            );

        }


        return Promise.reject(error);

    }

);


export default api;