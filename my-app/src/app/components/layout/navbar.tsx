"use client"
import { useTheme } from '../../context/ThemeContext';

export default function NavBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav style={{ background: theme === 'light' ? '#f0f0f0' : '#333', padding: '1rem', color: theme === 'light' ? '#333' : '#f0f0f0' }}>
      <button onClick={toggleTheme}>
        {theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
      </button>
    </nav>
  );
}
