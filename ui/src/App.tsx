import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:3001/api')
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching from API:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Dave AI</h1>
      <p>Davey Lopper the Assistant in Intelligence</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>API Response: {message || 'No response from API'}</p>
      )}
    </div>
  );
}

export default App;