import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

// Proxy endpoint for games and game details
app.get('/api/games', async (req, res) => {
  try {
    const apiUrl = `https://www.freetogame.com/api/games${req._parsedUrl.search || ''}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Error fetching games' });
  }
});

// Proxy endpoint for game details
app.get('/api/game', async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Game ID is required' });
  }

  try {
    const apiUrl = `https://www.freetogame.com/api/game?id=${id}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ error: 'Error fetching game details' });
  }
});

// Proxy endpoint for fetching games by category
app.get('/api/games/category', async (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }

  try {
    const apiUrl = `https://www.freetogame.com/api/games?category=${category}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching games by category:', error);
    res.status(500).json({ error: 'Error fetching games by category' });
  }
});

// Export the app for Vercel
export default app;

// Start the server (useful for local development)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
