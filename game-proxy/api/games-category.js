import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }

  try {
    const apiUrl = `https://www.freetogame.com/api/games?category=${category}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error fetching games by category:', error);
    res.status(500).json({ error: 'Error fetching games by category' });
  }
}
