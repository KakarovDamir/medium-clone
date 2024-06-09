// services/api.ts

import axios from 'axios';
import { Post } from '../models/post';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// services/api.ts

export const createPost = async (title: string, body: string) => {
  return await axios.post<Post>('/posts/add', { title, body, userId: 5,reactions: {likes: 0, dislikes: 0}, views: 0, tags: [] });
};

export const updatePost = async (id: number, title: string, userId: number) => {
  return await api.put(`/posts/${id}`, { title, userId });
};

export const deletePost = async (id: number) => {
  return await api.delete(`/posts/${id}`);
};
