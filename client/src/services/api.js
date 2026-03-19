import axios from "axios";

const API = axios.create({ baseURL: "https://mern-blog-backend-wdq0.onrender.com" });

// Attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401/403
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if ([401, 403].includes(err.response?.status)) {
      if (err.response?.data?.message?.toLowerCase().includes("token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

// Auth
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// Profile
export const getProfile = () => API.get("/profile/me");
// Update profile
export const updateProfile = (data) => {
  // Use the API instance to send the token automatically
  return API.put("/profile/me", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const getMyBlogs = () => API.get("/profile/blogs/me");
export const getLikedBlogs = () => API.get("/profile/blogs/liked/me");

// Blog
export const getAllBlogs = (page = 1, limit = 6, search = "") =>
  API.get(`/blog?page=${page}&limit=${limit}&search=${search}`);
export const getSingleBlog = (id) => API.get(`/blog/${id}`);
export const createBlog = (data) =>
  API.post("/blog", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateBlog = (id, data) => API.put(`/blog/${id}`, data);
export const deleteBlog = (id) => API.delete(`/blog/${id}`);
export const likeBlog = (id) => API.put(`/blog/like/${id}`);

// Comments
export const getComments = (blogId) => API.get(`/comments/${blogId}`);
export const addComment = (data) => API.post(`/comments`, data);
export const deleteComment = (id) => API.delete(`/comments/${id}`);

export default API;
