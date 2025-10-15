import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';

// GET /api/members - получить всех участников
// POST /api/members - создать нового участника
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();

    if (req.method === 'GET') {
      // Получить всех участников
      const result = await client.query(`
        SELECT * 
        FROM members 
        ORDER BY id DESC
      `);
      
      res.status(200).json({
        success: true,
        data: result.rows,
        count: result.rowCount,
        timestamp: new Date().toISOString()
      });

    } else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

  } finally {
    await client.end();
  }
}