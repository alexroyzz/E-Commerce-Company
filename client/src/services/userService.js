import api from "./api";

const getUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

const getUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

const updateUser = async (id, userData) => {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
};

const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

export default {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
