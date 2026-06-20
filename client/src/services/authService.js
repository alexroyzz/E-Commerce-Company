import api from "./api";

// Register a new user (supports FormData for profile picture upload)
const register = async (formData) => {
  const { data } = await api.post("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Login user
const login = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

// Get current logged-in user's profile
const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};

// Update user profile (name, email, password, profile picture)
const updateProfile = async (formData) => {
  const { data } = await api.put("/users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export default { register, login, getProfile, updateProfile };