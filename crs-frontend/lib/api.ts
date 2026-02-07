// import axios from "axios";
// import { getOfficerUser } from "./auth";

// export const api = axios.create({
//     baseURL: "http://localhost:4000/api",
// });

// api.interceptors.request.use((config) => {
//     const user = getOfficerUser();

//     if (user?.token) {
//         config.headers.Authorization = `Bearer ${user.token}`;
//     }

//     return config;
// });
import axios from "axios";
import { getToken } from "./auth";

export const api = axios.create({
    baseURL: "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("[Axios] Token added:", token.substring(0, 20) + "...");
    } else {
        console.warn("[Axios] No token for request");
    }
    return config;
});