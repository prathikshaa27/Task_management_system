import api from "../services/api";

export const loginUser = async ({ username, password }) => {
  const response = await api.post("users/token/", { username, password });
  return response.data;
};

export const signupUser = async ({ username, email, password }) => {
  const response = await api.post("users/register/", {
    username,
    email,
    password,
    password_check: password,
  });
  return response.data;
};

export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token available");

  const response = await api.post("users/token/refresh/", { refresh });
  const { access } = response.data;

  localStorage.setItem("access", access);
  return access;
};

export const changePassword = async ({ new_password, confirm_password }) => {
  const response = await api.post("users/change-password/", {
    new_password,
    confirm_password,
  });

  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await api.get("users/view/update/profile");
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put("users/view/update/profile", profileData);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("users/users");
  return response.data.results;
};

export const updateUserRole = async (userId, newRole) => {
  return await api.patch(`users/users/${userId}/`, {
    role: newRole,
  });
};
