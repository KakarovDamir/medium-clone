'use client'

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Post } from '../../models/post';
import { useTheme } from '../../context/ThemeContext';

export default function PostPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const response = await axios.get<Post>(`https://dummyjson.com/posts/${id}`);
          setPost(response.data);
        } catch (error) {
          setError('Failed to fetch post');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10" style={{ background: theme === 'light' ? '#f0f0f0' : '#333', color: theme === 'light' ? '#333' : '#f0f0f0' }}>
      <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>
      <p className="text-gray-700 text-lg">{post?.body}</p>
      {post?.tags && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Tags:</h2>
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-gray-600">
          <span className="font-semibold">Likes:</span> {post?.reactions.likes}
        </div>
        <div className="text-gray-600">
          <span className="font-semibold">Dislikes:</span> {post?.reactions.dislikes}
        </div>
        <div className="text-gray-600">
          <span className="font-semibold">Views:</span> {post?.views}
        </div>
      </div>
    </div>
  );
}
