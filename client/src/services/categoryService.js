import api from "./api";

const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

const getCategoryById = async (id) => {
  const { data } = await api.get(`/categories/${id}`);
  return data;
};

// ----- Admin -----

const createCategory = async (formData) => {
  const { data } = await api.post("/categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const updateCategory = async (id, formData) => {
  const { data } = await api.put(`/categories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const deleteCategory = async (id) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};