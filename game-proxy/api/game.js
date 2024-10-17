import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'Game ID is required' });
    }

    if (req.method === 'GET') {
        try {
            const apiUrl = `https://www.freetogame.com/api/game?id=${id}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching game details:', error);
            res.status(500).json({ error: 'Error fetching game details' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
