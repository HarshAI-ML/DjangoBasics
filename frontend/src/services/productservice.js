import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
// const API_URL = "http://127.0.0.1:8000/api/products/";
const API_URL = `${BASE_URL}/api/products/`
// GET all products
export const getProducts = async () => {
  return await axios.get(API_URL);
};

// CREATE product
export const createProduct = async (data) => {
  const config = data instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  return await axios.post(API_URL, data, config);
};
