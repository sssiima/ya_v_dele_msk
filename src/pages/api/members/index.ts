import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🎯 /api/members endpoint called');
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Просто возвращаем тестовые данные для проверки
    const testData = [
      { id: 1, first_name: 'Тест', last_name: 'Тестовый' },
      { id: 2, first_name: 'Пример', last_name: 'Примеров' }
    ];

    res.status(200).json({
      success: true,
      data: testData,
      count: testData.length,
      message: 'Тестовые данные - API работает!'
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}