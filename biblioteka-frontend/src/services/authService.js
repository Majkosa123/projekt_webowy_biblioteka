import api from "./api";

export const authService = {
  login: async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  register: async (username, password) => {
    return await api.post("/auth/register", { username, password });
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};
