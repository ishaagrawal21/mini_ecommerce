import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const fetchProducts = async (params) => {
  const res = await API.get("/products", { params });
  return res.data;
};

export const fetchProduct = async (id) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (data) => {
  let res;
  if (data.isFormData && data.payload instanceof FormData) {
    res = await API.post("/products", data.payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    res = await API.post("/products", data.payload || data);
  }
  return res.data;
};

export const updateProduct = async ({ id, payload, isFormData }) => {
  let res;
  if (isFormData && payload instanceof FormData) {
    res = await API.put(`/products/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    res = await API.put(`/products/${id}`, payload);
  }
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};

// Category API functions
export const fetchCategories = async (params) => {
  const res = await API.get("/categories", { params });
  return res.data;
};

export const fetchCategory = async (id) => {
  const res = await API.get(`/categories/${id}`);
  return res.data;
};

export const createCategory = async (payload) => {
  const res = await API.post("/categories", payload);
  return res.data;
};

export const updateCategory = async ({ id, payload }) => {
  const res = await API.put(`/categories/${id}`, payload);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await API.delete(`/categories/${id}`);
  return res.data;
};

// Authentication API functions
export const signUp = async (payload) => {
  const res = await API.post("/auth/signup", payload);
  return res.data;
};

export const signIn = async (payload) => {
  const res = await API.post("/auth/signin", payload);
  return res.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  const res = await API.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});