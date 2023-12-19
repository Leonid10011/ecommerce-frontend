import axios from "axios";

const BASE_URL = process.env.API_URL;

export const API = axios.create({
    baseURL: BASE_URL,
});