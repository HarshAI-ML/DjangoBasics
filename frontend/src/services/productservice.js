import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/products/";

// GET all products
export const getProducts = async () => {
  return await axios.get(API_URL);
};

// CREATE product
export const createProduct = async (data) => {
  return await axios.post(API_URL, data);
};