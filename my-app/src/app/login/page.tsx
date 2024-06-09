'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const {theme} = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      login(response.data.token);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className={`p-4 ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-gray-200'}`}>
    <div className={`${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-gray-200'}flex items-center justify-center min-h-screen bg-gray-100`}>
      <div className=" w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md ">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username:
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password:
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </label>
          </div>
          <button type="submit" className="w-full py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
            Login
          </button>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
    </div>
  );
}
