import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for Clerk Auth integration (to be expanded when clerk is wired)
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// --- Posts ---
export const fetchPosts = async (params = {}) => {
  const response = await api.get('/posts', { params });
  return response.data;
};

export const fetchPostBySlug = async (slug) => {
  const response = await api.get(`/posts/${slug}`);
  return response.data;
};

export const fetchRelatedPosts = async (id) => {
  const response = await api.get(`/posts/${id}/related`);
  return response.data;
};

export const incrementPostViews = async (id) => {
  const response = await api.post(`/posts/${id}/view`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/posts', postData);
  return response.data;
};

export const updatePost = async (id, updates) => {
  const response = await api.put(`/posts/${id}`, updates);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

// --- Bookmarks ---
export const toggleBookmark = async (postId) => {
  const response = await api.post(`/bookmarks/${postId}`);
  return response.data;
};

// --- Categories ---
export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const fetchCategoryBySlug = async (slug) => {
  const response = await api.get(`/categories/${slug}`);
  return response.data;
};

// --- Admin ---
export const fetchAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const fetchAdminPosts = async () => {
  const response = await api.get('/admin/posts');
  return response.data;
};

export const fetchAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

// --- Comments ---
export const fetchComments = async (postId) => {
  const response = await api.get(`/comments/post/${postId}`);
  return response.data;
};

export const createComment = async (commentData) => {
  const response = await api.post('/comments', commentData);
  return response.data;
};

export const likeComment = async (id) => {
  const response = await api.post(`/comments/${id}/like`);
  return response.data;
};

export const unlikeComment = async (id) => {
  const response = await api.delete(`/comments/${id}/like`);
  return response.data;
};

// --- User / Profile ---
export const fetchUserProfile = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const fetchUserStats = async (id) => {
  const response = await api.get(`/users/${id}/stats`);
  return response.data;
};

export const fetchUserPosts = async (id) => {
  const response = await api.get(`/users/${id}/posts`);
  return response.data;
};

export const updateUserProfile = async (id, profileData) => {
  const response = await api.put(`/users/${id}`, profileData);
  return response.data;
};

// --- Settings ---
export const fetchSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

// --- Upload ---
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export default api;
