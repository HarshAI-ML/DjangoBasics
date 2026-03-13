import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const API_URL = `${BASE_URL}/api/staff/`;

export const getStaff = async () => {
  return await axios.get(API_URL);
};

export const createStaff = async (data) => {
  console.log(data, "from services file");
  return await axios.post(API_URL, data);
};

