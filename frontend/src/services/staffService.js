import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/staff/";

export const getStaff = async () => {
  return await axios.get(API_URL);
};

export const createStaff = async (data) => {
  console.log(data,"from services file ")
  return await axios.post(API_URL, data);
};
