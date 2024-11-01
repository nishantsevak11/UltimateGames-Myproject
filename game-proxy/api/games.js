import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const apiUrl = `https://www.freetogame.com/api/games${req.query ? '?' + new URLSearchParams(req.query) : ''}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Error fetching games' });
  }
}
