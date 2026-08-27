import axios from "axios";

const rawApiUrl =
    import.meta.env.VITE_API_URL;

if (!rawApiUrl) {
    throw new Error(
        "VITE_API_URL is not configured."
    );
}

const baseURL =
    rawApiUrl.replace(/\/+$/, "").endsWith("/api")
        ? rawApiUrl.replace(/\/+$/, "")
        : `${rawApiUrl.replace(/\/+$/, "")}/api`;

const api = axios.create({
    baseURL,
    headers: {
        Accept: "application/json",
    },
});

export default api;
