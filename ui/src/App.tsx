import { useState, useEffect } from 'react';
import { Chat, Navigation } from './components';
import { getBrowserTheme } from './utils/getBrowserTheme';

function App() {
  const [theme, setTheme] = useState('');

  useEffect(() => {
    setTheme(localStorage.getItem('theme') ?? getBrowserTheme());
  }, []);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((currentTheme) => {
      const theme = currentTheme === 'dark' ? 'light' : 'dark';

      localStorage.setItem('theme', theme);

      return theme;
    });
  };

  return (
    <main>
      <Navigation onToggleTheme={handleToggleTheme} />
      <Chat />
    </main>
  );
}

export default App;