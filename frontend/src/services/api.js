import axios from "axios";


const api = axios.create({

    baseURL: "http://localhost:5000/api",

    headers: {
        "Content-Type": "application/json"
    }

});


// ==========================================
// ADD JWT TO EVERY REQUEST
// ==========================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");


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


// ==========================================
// HANDLE AUTH ERRORS
// ==========================================

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

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


await api.post(
    `/clients/${id}/documents`,
    formData
);

export default api;