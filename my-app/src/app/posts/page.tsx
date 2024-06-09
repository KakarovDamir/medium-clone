"use client"

import { useEffect, useState } from 'react';
import { Post } from '../models/post';
import api, { createPost, updatePost, deletePost } from '../services/api';
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

export default function PostsList() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [updatedPost, setUpdatedPost] = useState<Post | null>(null);
  const [updatedPostTitle, setUpdatedPostTitle] = useState('');
  const [updatedUserId, setUpdatedUserId] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<{ posts: Post[] }>('/auth/posts');
        setPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch posts');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreatePost = async () => {
    try {
      const response = await createPost(newPostTitle, newPostBody);
      setPosts([...posts, response.data]);
      setNewPostTitle('');
      setNewPostBody('');
    } catch (err) {
      setError('Failed to create post');
      console.error(err); // Вывод ошибки в консоль
    }
  };

  const handleStartUpdate = (post: Post) => {
    setUpdatedPost(post);
    setUpdatedPostTitle(post.title);
    setUpdatedUserId(post.userId);
  };

  const handleCancelUpdate = () => {
    setUpdatedPost(null);
    setUpdatedPostTitle('');
    setUpdatedUserId(0);
  };

  const handleUpdatePost = async (id: number) => {
    try {
      const response = await updatePost(id, updatedPostTitle, updatedUserId);
      setPosts(posts.map(post => (post.id === id ? response.data : post)));
      handleCancelUpdate();
    } catch (err) {
      setError('Failed to update post');
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10" style={{ background: theme === 'light' ? '#f0f0f0' : '#333', color: theme === 'light' ? '#333' : '#f0f0f0' }}>
    <h1 className="text-3xl font-bold mb-6">Posts</h1>
    <div className="mb-6">
      <input
        className="border border-gray-300 rounded-md p-2 mb-2 block w-full"
        type="text"
        placeholder="New Post Title"
        value={newPostTitle}
        onChange={(e) => setNewPostTitle(e.target.value)}
      />
      <textarea
        className="border border-gray-300 rounded-md p-2 mb-2 block w-full"
        placeholder="New Post Body"
        value={newPostBody}
        onChange={(e) => setNewPostBody(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={handleCreatePost}
      >
        Create Post
      </button>
    </div>
    <ul>
      {posts.map((post) => (
        <li key={post.id} className="border-b border-gray-300 py-4">
          <div className="flex items-center justify-between">
            <div>
              {updatedPost === post ? (
                <input
                  className="border border-gray-300 rounded-md p-2 mr-2"
                  type="text"
                  placeholder="Updated Post Title"
                  value={updatedPostTitle}
                  onChange={(e) => setUpdatedPostTitle(e.target.value)}
                />
              ) : (
                <a
                  onClick={() => router.push(`/posts/${post.id}`)}
                  className="cursor-pointer text-blue-500 hover:underline mr-4"
                >
                  {post.title}
                </a>
              )}
              <span className="text-gray-500">by User {post.userId}</span>
            </div>
            <div className="flex items-center">
              {post.reactions && (
                <div className="mr-4">
                  <span className="text-green-500">Likes: {post.reactions.likes}</span>
                  <span className="text-red-500 ml-2">Dislikes: {post.reactions.dislikes}</span>
                </div>
              )}
              <span className="text-gray-600">Views: {post.views}</span>
              {updatedPost === post ? (
                <div className="ml-4">
                  <input
                    className="border border-gray-300 rounded-md p-1 mr-2"
                    type="number"
                    placeholder="Updated User ID"
                    value={updatedUserId}
                    onChange={(e) => setUpdatedUserId(parseInt(e.target.value))}
                  />
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded-md mr-2"
                    onClick={() => handleUpdatePost(post.id)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-2 py-1 rounded-md"
                    onClick={handleCancelUpdate}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="ml-4">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                    onClick={() => handleStartUpdate(post)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
  

  );
}
