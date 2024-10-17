// api/games.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Get any query parameters
            const apiUrl = `https://www.freetogame.com/api/games${req._parsedUrl.search || ''}`;
            const response = await fetch(apiUrl);

            // Check if response is okay
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching games:', error);
            res.status(500).json({ error: 'Error fetching games' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
