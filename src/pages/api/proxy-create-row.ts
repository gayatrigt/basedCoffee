import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { goal, fid, goalamt } = req.body;

        const response = await fetch('https://cryptocoffee-opal.vercel.app/api/create-row', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ goal, fid, goalamt }),
        });

        if (!response.ok) {
            throw new Error('Failed to create channel');
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error in proxy API:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}