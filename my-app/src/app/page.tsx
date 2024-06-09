'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import PostsList from './posts/page';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Перенаправляем на страницу логина, если пользователь не авторизован
    }
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PostsList/>
    </main>
  );
}
