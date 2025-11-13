const express = require('express')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const router = express.Router();
const { verifyConnection, pool } = require('./db')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Папка для загрузок
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer для загрузки PDF файлов
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB лимит
  },
  fileFilter: function (req, file, cb) {
    // Проверяем тип файла
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только PDF файлы'), false);
    }
  }
});

// Multer для загрузки фото (изображений) - принимаем любые изображения
const uploadPhoto = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB лимит для фото (увеличен)
  },
  fileFilter: function (req, file, cb) {
    // Принимаем любые изображения, если не изображение - тоже пропускаем
    cb(null, true);
  }
});

async function ensureTeamsTable() {
  const createQuery = `
    CREATE TABLE IF NOT EXISTS teams (
      id SERIAL PRIMARY KEY,
      code VARCHAR(64) NOT NULL UNIQUE,
      name VARCHAR(255),
      mentor VARCHAR(255),
      coord VARCHAR(255),
      ro VARCHAR(255),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_teams_code ON teams (code);
    CREATE INDEX IF NOT EXISTS idx_teams_mentor ON teams (mentor);
  `
  await pool.query(createQuery)

  // Defensive: ensure legacy tables have necessary columns and uniqueness
  await pool.query(`
    ALTER TABLE teams
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  `)
  await pool.query(`
    ALTER TABLE teams
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  `)
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE schemaname = ANY(current_schemas(false)) AND indexname = 'teams_code_unique'
      ) THEN
        CREATE UNIQUE INDEX teams_code_unique ON teams(code);
      END IF;
    END$$;
  `)
}

dotenv.config()

const app = express()
app.use('/images', express.static('public/images'));
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// Обработчик для всех OPTIONS запросов - должен быть первым
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    // CORS preflight handled
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Credentials', 'true')
    return res.status(200).end()
  }
  next()
})

// Глобальный обработчик CORS для всех остальных запросов
app.use((req, res, next) => {
  // request received
  
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  next()
})
app.use(express.json())


app.get('/', (_req, res) => {
  res.send('API server is running. Use /api/* endpoints.')
})

app.get('/api', (_req, res) => {
  res.json({ message: 'API is running', endpoints: ['/api/health', '/api/structure', '/api/test'] })
})

// Тестовый эндпоинт для проверки CORS
app.get('/api/test', (_req, res) => {
  res.json({ message: 'CORS test successful', timestamp: new Date().toISOString() })
})


app.get('/api/health', async (_req, res) => {
  try {
    await verifyConnection()
    await ensureTeamsTable()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ ok: false })
  }
})

app.get('/api/vuses', async (req, res) => {
  try {
    // vuses requested
    
    const client = await pool.connect();
    const result = await client.query('SELECT id, vus FROM vuses ORDER BY vus');
    client.release();
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    // db error
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// routes/mentors.js или в server.js
app.get('/api/mentors', async (req, res) => {
  let client;
  try {
    // mentors requested
    client = await pool.connect();
    // Запрос для получения всех наставников и старших наставников без сортировки/дедупликации
    const result = await client.query(`
      SELECT 
        id,
        first_name,
        last_name,
        CONCAT(first_name, ' ', last_name) as full_name,
        pos
      FROM structure
      WHERE pos IN ('наставник', 'старший наставник') AND COALESCE(archived,false) = false
    `);
    
    // mentors count
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    // db error
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    if (client) client.release();
  }
});

// server/routes/members.js


// POST /api/members - создание нового участника
router.post('/', async (req, res) => {
  try {
    const {
      last_name,
      first_name,
      patronymic,
      birth_date,
      gender,
      vk_link,
      phone,
      education,
      level,
      grade,
      format,
      faculty,
      specialty,
      username,
      password,
      mentor,
      team_code,
      team_name,
      role,
      privacy_policy
    } = req.body;

    // Проверка обязательных полей
    if (!last_name || !first_name || !patronymic || !birth_date || !gender || 
        !vk_link || !phone || !username || !password || !mentor || !team_code || 
        !role || privacy_policy === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Все обязательные поля должны быть заполнены' 
      });
    }

    // Проверка уникальности email (username)
    const existingMember = await pool.query(
      'SELECT id FROM members WHERE username = $1 AND COALESCE(archived,false) = false',
      [username]
    );

    if (existingMember.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует'
      });
    }

    // Валидация team_code
    if (role === 'captain') {
      // Для капитана: код команды должен быть уникальным
      const existingCode = await pool.query(
      'SELECT id FROM members WHERE team_code = $1 AND COALESCE(archived,false) = false',
        [team_code]
      );
      if (existingCode.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Этот код команды уже используется'
        });
      }
      // Капитан должен указать название команды
      if (!team_name || team_name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Название команды обязательно для капитана'
        });
      }
    } else if (role === 'member') {
      // Для участника: код команды должен существовать у капитана
      const captainWithCode = await pool.query(
        "SELECT id FROM members WHERE team_code = $1 AND role = 'captain' AND COALESCE(archived,false) = false",
        [team_code]
      );
      if (captainWithCode.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Неверный код команды. Обратитесь к капитану за правильным кодом'
        });
      }
    }

    // Хеширование пароля
    const password_hash = await bcrypt.hash(password, 10);

    // Вставка данных в базу (храним только password_hash)
    const query = `
      INSERT INTO members (
        last_name, first_name, patronymic, birth_date, gender, vk_link, phone,
        education, level, grade, format, faculty, specialty, username, password_hash,
        mentor, team_code, team_name, role, privacy_policy, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, COALESCE($21::timestamptz, NOW()))
      RETURNING *
    `;

    const values = [
      last_name, first_name, patronymic, birth_date, gender, vk_link, phone,
      education, level, grade, format, faculty, specialty, username, password_hash,
      mentor, team_code, team_name, role, privacy_policy, req.body?.created_at || null
    ];

    const result = await pool.query(query, values);
    const created = result.rows[0]

    // Если зарегистрирован капитан, создаем/обновляем запись в teams
    if (role === 'captain') {
      try {
        await ensureTeamsTable()
        // Upsert команды по коду
        await pool.query(
          `INSERT INTO teams (code, name, mentor)
           VALUES ($1, $2, $3)
           ON CONFLICT (code) DO UPDATE SET
             name = EXCLUDED.name,
             mentor = EXCLUDED.mentor,
             updated_at = NOW()`,
          [team_code, team_name, mentor]
        )

        // Обновляем coord и ro из таблицы structure на основании ФИО наставника
        await pool.query(
          `UPDATE teams
             SET coord = s.coord,
                 ro = s.ro
           FROM structure s
           WHERE teams.code = $1
             AND teams.mentor IS NOT NULL
             AND (s.last_name || ' ' || s.first_name = teams.mentor
               OR s.first_name || ' ' || s.last_name = teams.mentor)`,
          [team_code]
        )

        // Верификация вставки (логирование)
        const verify = await pool.query('SELECT id, code, name, mentor FROM teams WHERE code = $1 LIMIT 1', [team_code])
        if (verify.rows.length === 0) {
          console.warn('Team upsert verification failed for code:', team_code)
        } else {
          console.log('Team upserted')
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to upsert team for captain:', e)
      }
    }

    res.status(201).json({
      success: true,
      message: 'Участник успешно зарегистрирован',
      data: created
    });

  } catch (error) {
    // error
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при создании участника'
    });
  }
});

module.exports = router;

// Подключаем роутер участников
app.use('/api/members', router)

// GET /api/members - получить список участников
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        last_name,
        first_name,
        patronymic,
        birth_date,
        gender,
        vk_link,
        phone,
        education,
        level,
        grade,
        format,
        faculty,
        specialty,
        username,
        mentor,
        team_code,
        team_name,
        role,
        COALESCE(archived,false) as archived,
        created_at
      FROM members
      WHERE COALESCE(archived,false) = false
      ORDER BY created_at DESC
    `)
    res.json({ success: true, data: result.rows })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// GET /api/members/:id - получить участника по id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT id, last_name, first_name, patronymic, birth_date, gender, vk_link, phone, education, level, grade, format, faculty, specialty, username, mentor, team_code, team_name, role, COALESCE(archived,false) as archived, created_at FROM members WHERE id = $1 AND COALESCE(archived,false) = false`,
      [id]
    )
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, data: result.rows[0] })
  } catch (_e) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// PUT /api/members/:id - обновить данные участника
router.put('/:id', async (req, res) => {
  const allowedFields = [
    'last_name',
    'first_name',
    'patronymic',
    'birth_date',
    'gender',
    'vk_link',
    'phone',
    'education',
    'level',
    'grade',
    'format',
    'faculty',
    'specialty',
    'username',
    'team_name'
  ]

  try {
    const { id } = req.params
    const incoming = req.body || {}

    // Собираем динамический UPDATE только по разрешённым полям
    const setClauses = []
    const values = []
    let idx = 1
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(incoming, key)) {
        setClauses.push(`${key} = $${idx}`)
        values.push(incoming[key])
        idx += 1
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ success: false, message: 'No updatable fields provided' })
    }

    const updateQuery = `
      UPDATE members
      SET ${setClauses.join(', ')}
      WHERE id = $${idx}
      RETURNING id, last_name, first_name, patronymic, birth_date, gender, vk_link, phone, education, level, grade, format, faculty, specialty, username, mentor, team_code, team_name, role, created_at
    `
    values.push(id)

    const result = await pool.query(updateQuery, values)
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' })
    return res.json({ success: true, data: result.rows[0] })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// Простая авторизация участников: POST /api/auth/member-login
app.post('/api/auth/member-login', async (req, res) => {
  try {
    const { username, password } = req.body || {}
    if (!username || !password) return res.status(400).json({ success: false, message: 'Missing credentials' })
    const result = await pool.query('SELECT id, password_hash, COALESCE(archived,false) as archived FROM members WHERE username = $1', [username])
    if (result.rows.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' })
    if (result.rows[0].archived) return res.status(403).json({ success: false, message: 'Account archived' })
    const ok = await bcrypt.compare(password, result.rows[0].password_hash || '')
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' })
    // Возвращаем id участника; храните его в localStorage на фронте
    return res.json({ success: true, data: { id: result.rows[0].id } })
  } catch (_e) {
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// Простая авторизация структуры: POST /api/auth/structure-login
app.post('/api/auth/structure-login', async (req, res) => {
  try {
    let { username, password } = req.body || {}
    if (typeof username === 'string') username = username.trim()
    if (typeof password === 'string') password = password.trim()
    if (!username || !password) return res.status(400).json({ success: false, message: 'Missing credentials' })

    const result = await pool.query(
      'SELECT ctid::text as ctid, password_hash, COALESCE(archived,false) as archived FROM structure WHERE LOWER(username) = LOWER($1) LIMIT 1',
      [username]
    )
    if (result.rows.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const row = result.rows[0]
    if (row.archived) return res.status(403).json({ success: false, message: 'Account archived' })
    const ok = await bcrypt.compare(password, row.password_hash || '')

    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' })
    return res.json({ success: true, data: { ctid: row.ctid } })
  } catch (_e) {
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// POST /api/auth/check-username - проверка наличия username в members или structure
app.post('/api/auth/check-username', async (req, res) => {
  try {
    const { username } = req.body || {}
    if (!username) return res.status(400).json({ success: false, message: 'Missing username' })

    const [mem, str] = await Promise.all([
      pool.query('SELECT 1 FROM members WHERE username = $1 LIMIT 1', [username]),
      pool.query('SELECT 1 FROM structure WHERE username = $1 LIMIT 1', [username])
    ])

    let foundIn = null
    if (mem.rows.length > 0) foundIn = 'member'
    if (str.rows.length > 0) foundIn = foundIn ? 'both' : 'structure'

    return res.json({ success: true, data: { foundIn } })
  } catch (_e) {
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// POST /api/auth/get-reset-info - получить информацию для восстановления пароля
app.post('/api/auth/get-reset-info', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Email обязателен'
      });
    }

    // Ищем пользователя в таблице members
    const memberQuery = `
      SELECT last_name, first_name, patronymic 
      FROM members 
      WHERE username = $1 AND COALESCE(archived, false) = false
      LIMIT 1
    `;
    
    // Ищем пользователя в таблице structure  
    const structureQuery = `
      SELECT last_name, first_name, patronymic
      FROM structure 
      WHERE username = $1 AND COALESCE(archived, false) = false
      LIMIT 1
    `;

    const [memberResults, structureResults] = await Promise.all([
      pool.query(memberQuery, [username]),
      pool.query(structureQuery, [username])
    ]);

    let userData = null;
    let foundIn = null;

    // Приоритет: members > structure
    if (memberResults.rows.length > 0) {
      userData = memberResults.rows[0];
      foundIn = structureResults.rows.length > 0 ? 'both' : 'member';
    } else if (structureResults.rows.length > 0) {
      userData = structureResults.rows[0];
      foundIn = 'structure';
    }

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    res.json({
      success: true,
      data: {
        last_name: userData.last_name || '',
        first_name: userData.first_name || '',
        patronymic: userData.patronymic || '',
        foundIn: foundIn
      }
    });

  } catch (error) {
    console.error('Error in get-reset-info:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

const nodemailer = require('nodemailer');

// Функция для отправки email с новым паролем
const sendPasswordEmail = async (email, newPassword) => {
  try {
    console.log('📧 Attempting to send email to:', email);
    
    // Создаем транспортер для отправки email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Программа "Я в деле": Восстановление пароля от личного кабинета.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://api-production-2fd7.up.railway.app/images/email.png" alt="Я в деле" style="height: auto; max-width: 600px;" />
          </div>
          <p">Здравствуйте!</p>
          <p>Не расстраивайтесь, мы все иногда забываем пароли.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #08A6A5;">
              Ваш новый пароль для входа в систему: <strong>${newPassword}</strong>
            </p>
          </div>
          <p>
              Сохраните этот пароль в надежном месте и используйте его для входа в систему.
          </p>
          <a href="https://yavdelemsk-production.up.railway.app" style="text-decoration: none;">
          <button style="background-color: #08A6A5; color: white; font-weight: 800; border-radius: 100px; padding: 12px 24px; border: none; cursor: pointer;">
            Вернуться на платформу
          </button>
          </a>
          <p style="color: #666; font-size: 14px; font-style: italic;">
            Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            С уважением,<br>
            Команда программы "Я в деле"
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Не удалось отправить email с паролем');
  }
};

// PUT /api/auth/update-password - обновление пароля пользователя и отправка на email
app.put('/api/auth/update-password', async (req, res) => {
  console.log('Update password request received:', { username: req.body.username });
  
  try {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
      console.log('Missing required fields:', { username: !!username, newPassword: !!newPassword });
      return res.status(400).json({
        success: false,
        message: 'Email и новый пароль обязательны'
      });
    }

    // Хешируем новый пароль
    const password_hash = await bcrypt.hash(newPassword, 10);
    console.log('Password hashed successfully');

    let updated = false;
    let foundIn = null;

    // Пробуем обновить пароль в members
    try {
      console.log('Updating password in members table for:', username);
      const memberResult = await pool.query(
        'UPDATE members SET password_hash = $1 WHERE username = $2 AND COALESCE(archived, false) = false RETURNING id',
        [password_hash, username]
      );

      if (memberResult.rows.length > 0) {
        updated = true;
        foundIn = 'member';
        console.log('Password updated in members, affected rows:', memberResult.rows.length);
      }
    } catch (memberError) {
      console.error('Error updating members table:', memberError);
    }

    // Пробуем обновить пароль в structure
    try {
      console.log('Updating password in structure table for:', username);
      const structureResult = await pool.query(
        'UPDATE structure SET password_hash = $1 WHERE username = $2 AND COALESCE(archived, false) = false RETURNING id',
        [password_hash, username]
      );

      if (structureResult.rows.length > 0) {
        updated = true;
        foundIn = foundIn ? 'both' : 'structure';
        console.log('Password updated in structure, affected rows:', structureResult.rows.length);
      }
    } catch (structureError) {
      console.error('Error updating structure table:', structureError);
    }

    if (!updated) {
      console.log('User not found in any table:', username);
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    // Отправляем пароль на email
    try {
      await sendPasswordEmail(username, newPassword);
      console.log('Password email sent successfully to:', username);
    } catch (emailError) {
      console.error('Failed to send email, but password was updated:', emailError);
      // Пароль обновлен, но email не отправлен - все равно считаем успехом
    }

    console.log('Password update successful for:', username, 'found in:', foundIn);
    res.json({
      success: true,
      message: 'Новый пароль отправлен на вашу почту',
      data: { foundIn }
    });

  } catch (error) {
    console.error('Critical error in update-password:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера при обновлении пароля'
    });
  }
});


app.post('/api/structure', async (req, res) => {
  try {
    // structure registration request received
    
    const {
      last_name,
      first_name,
      patronymic,
      birth_date,
      gender,
      vk_link,
      phone,
      education,
      grade,
      photo_url,
      pos,
      username,
      password,
      high_mentor,
      coord,
      ro,
      privacy_policy,
    } = req.body || {}

    // Проверяем каждое поле отдельно для лучшей диагностики
    const missingFields = []
    if (!last_name) missingFields.push('last_name')
    if (!first_name) missingFields.push('first_name')
    if (!birth_date) missingFields.push('birth_date')
    if (!gender) missingFields.push('gender')
    if (!vk_link) missingFields.push('vk_link')
    if (!phone) missingFields.push('phone')
    if (!education) missingFields.push('education')
    if (!grade) missingFields.push('grade')
    if (!pos) missingFields.push('pos')
    if (!username) missingFields.push('username')
    if (!password) missingFields.push('password')
    if (privacy_policy === undefined || privacy_policy === null) missingFields.push('privacy_policy')

    if (missingFields.length > 0) {
      // missing fields
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields', 
        missingFields: missingFields 
      })
    }

    const password_hash = await bcrypt.hash(password, 10)
    const insertQuery = `
      INSERT INTO structure (
        last_name, first_name, patronymic, birth_date, gender, vk_link, phone, education, grade, photo_url, pos,
        username, password_hash, high_mentor, coord, ro, privacy_policy
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING id
    `
    const values = [
      last_name,
      first_name,
      patronymic || null,
      birth_date,
      gender,
      vk_link,
      phone,
      education,
      grade,
      photo_url || null,
      pos,
      username,
      password_hash,
      high_mentor || null,
      coord || null,
      ro || null,
      Boolean(privacy_policy),
    ]

    const result = await pool.query(insertQuery, values)
    return res.status(201).json({ success: true, data: { id: result.rows[0].id } })
  } catch (err) {
    // server error
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// GET /api/structure - получить список зарегистрированных в структуре
app.get('/api/structure', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        ctid::text as ctid,
        last_name,
        first_name,
        patronymic,
        birth_date,
        gender,
        vk_link,
        phone,
        education,
        grade,
        level,
        faculty,
        format,
        specialty,
        pos,
        username,
        high_mentor,
        coord,
        ro,
        COALESCE(archived,false) as archived,
        created_at
      FROM structure
      WHERE COALESCE(archived,false) = false
      ORDER BY created_at DESC
    `)
    res.json({ success: true, data: result.rows })
  } catch (_error) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// GET /api/structure/by-ctid/:ctid - получить запись структуры по ctid
app.get('/api/structure/by-ctid/:ctid', async (req, res) => {
  try {
    const { ctid } = req.params
    const result = await pool.query(
      `SELECT 
        id,
        last_name,
        first_name,
        patronymic,
        birth_date,
        gender,
        vk_link,
        phone,
        education,
        grade,
        level,
        faculty,
        format,
        specialty,
        pos,
        username,
        high_mentor,
        coord,
        ro,
        COALESCE(archived,false) as archived,
        created_at
      FROM structure WHERE ctid::text = $1 AND COALESCE(archived,false) = false`,
      [ctid]
    )
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' })
    return res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// GET /api/structure/:id - получить запись структуры по id
app.get('/api/structure/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT 
        id,
        last_name,
        first_name,
        patronymic,
        birth_date,
        gender,
        vk_link,
        phone,
        education,
        grade,
        level,
        faculty,
        format,
        specialty,
        pos,
        username,
        high_mentor,
        coord,
        ro,
        COALESCE(archived,false) as archived,
        created_at
      FROM structure WHERE id = $1 AND COALESCE(archived,false) = false`, [id])
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' })
    return res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// PUT /api/structure/:id - обновить запись структуры
app.put('/api/structure/:id', async (req, res) => {
  try {
    const { id } = req.params
    const allowed = ['last_name','first_name','patronymic','birth_date','gender','vk_link','phone','education','grade','level','faculty','format','specialty','photo_url','pos','username','high_mentor','coord','ro']
    const incoming = req.body || {}
    const set = []
    const values = []
    let i = 1
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(incoming, key)) {
        set.push(`${key} = $${i}`)
        values.push(incoming[key])
        i++
      }
    }
    if (set.length === 0) return res.status(400).json({ success: false, message: 'No updatable fields provided' })
    const q = `UPDATE structure SET ${set.join(', ')} WHERE id = $${i} RETURNING id`
    values.push(id)
    const result = await pool.query(q, values)
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' })
    return res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// PUT /api/structure/by-ctid/:ctid - обновить запись структуры по ctid
app.put('/api/structure/by-ctid/:ctid', async (req, res) => {
  try {
    const { ctid } = req.params
    console.log('Updating structure')
    const allowed = ['last_name','first_name','patronymic','birth_date','gender','vk_link','phone','education','grade','level','faculty','format','specialty','photo_url','pos','username','high_mentor','coord','ro']
    const incoming = req.body || {}
    const set = []
    const values = []
    let i = 1
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(incoming, key)) {
        set.push(`${key} = $${i}`)
        values.push(incoming[key])
        i++
      }
    }
    if (set.length === 0) return res.status(400).json({ success: false, message: 'No updatable fields provided' })
    const q = `UPDATE structure SET ${set.join(', ')} WHERE ctid::text = $${i} RETURNING ctid::text as ctid`
    values.push(ctid)
    console.log('Query')
    const result = await pool.query(q, values)
    console.log('Update result')
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' })
    return res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error updating structure by ctid:', err)
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// API для команд
// PUT /api/teams/:teamCode/track - обновить трек для команды во всех таблицах
app.put('/api/teams/:teamCode/track', async (req, res) => {
  let client;
  try {
    const { teamCode } = req.params;
    const { track } = req.body;

    if (!teamCode) {
      return res.status(400).json({
        success: false,
        message: 'Код команды не указан'
      });
    }

    if (!track) {
      return res.status(400).json({
        success: false,
        message: 'Трек не указан'
      });
    }

    client = await pool.connect();

    // Обновляем трек в таблице teams
    await client.query(`
      UPDATE teams 
      SET track = $1 
      WHERE code = $2
    `, [track, teamCode]);

    // Обновляем трек в таблице members для всех участников команды
    await client.query(`
      UPDATE members 
      SET track = $1 
      WHERE team_code = $2 AND COALESCE(archived, false) = false
    `, [track, teamCode]);

    // Обновляем трек в таблице homeworks для всех домашних заданий команды
    await client.query(`
      UPDATE homeworks 
      SET track = $1 
      WHERE team_code = $2
    `, [track, teamCode]);

    // Обновляем трек в таблице mero-reg для всех регистраций команды
    // Проверяем наличие колонки track в mero-reg и добавляем, если нужно
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mero-reg' AND column_name='track') THEN
          ALTER TABLE "mero-reg" ADD COLUMN track TEXT;
        END IF;
      END $$;
    `);
    
    await client.query(`
      UPDATE "mero-reg" 
      SET track = $1
      WHERE team_code = $2
    `, [track, teamCode]);

    res.json({
      success: true,
      message: 'Трек успешно обновлен'
    });
  } catch (error) {
    console.error('Error updating track:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении трека: ' + error.message
    });
  } finally {
    if (client) client.release();
  }
});

// GET /api/teams - получить все команды
app.get('/api/teams', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teams ORDER BY name')
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error fetching teams:', err)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// GET /api/teams/:id - получить команду по ID
app.get('/api/teams/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM teams WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Team not found' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error fetching team:', err)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// GET /api/teams/by-mentor/:mentorName - получить команды по имени наставника
app.get('/api/teams/by-mentor/:mentorName', async (req, res) => {
  try {
    const { mentorName } = req.params
    const decodedMentorName = decodeURIComponent(mentorName)
    
    // Ищем команды где mentor совпадает с именем (с учетом возможных вариантов ФИО)
    const result = await pool.query(`
      SELECT * FROM teams 
      WHERE mentor ILIKE $1 OR mentor ILIKE $2
      ORDER BY name
    `, [`%${decodedMentorName}%`, `%${decodedMentorName.split(' ').reverse().join(' ')}%`])
    
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error fetching teams by mentor:', err)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// GET /api/teams/by-code/:teamCode - получить команду по коду команды
app.get('/api/teams/by-code/:teamCode', async (req, res) => {
  try {
    const { teamCode } = req.params
    const decoded = decodeURIComponent(teamCode)
    const result = await pool.query('SELECT * FROM teams WHERE code = $1 LIMIT 1', [decoded])
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Team not found' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error fetching team by code:', err)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// PUT /api/teams/rename - сменить название команды и обновить у участников
app.put('/api/teams/rename', async (req, res) => {
  const { code, newName } = req.body || {}
  if (!code || !newName) return res.status(400).json({ success: false, message: 'Missing code or newName' })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    // Обновляем название команды в teams
    await client.query('UPDATE teams SET name = $1, updated_at = NOW() WHERE code = $2', [newName, code])
    // Обновляем у всех участников с этим кодом
    await client.query("UPDATE members SET team_name = $1 WHERE team_code = $2", [newName, code])
    await client.query('COMMIT')
    return res.json({ success: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error renaming team:', err)
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  } finally {
    client.release()
  }
})

// PUT /api/structure/:id/archive - пометить запись структуры как archived=true
app.put('/api/structure/:id/archive', async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('UPDATE structure SET archived = true WHERE id = $1', [id])
    return res.json({ success: true })
  } catch (err) {
    console.error('Error archiving structure user:', err)
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// PUT /api/structure/by-ctid/:ctid/archive - пометить запись структуры как archived=true по ctid
app.put('/api/structure/by-ctid/:ctid/archive', async (req, res) => {
  try {
    const { ctid } = req.params
    await pool.query('UPDATE structure SET archived = true WHERE ctid::text = $1', [ctid])
    return res.json({ success: true })
  } catch (err) {
    console.error('Error archiving structure user by ctid:', err)
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// PUT /api/members/:id/archive - пометить участника как archived=true
app.put('/api/members/:id/archive', async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('UPDATE members SET archived = true WHERE id = $1', [id])
    return res.json({ success: true })
  } catch (err) {
    console.error('Error archiving member:', err)
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// PUT /api/members/:id/change-team - изменить код команды и название команды у участника
app.put('/api/members/:id/change-team', async (req, res) => {
  let client;
  try {
    const { id } = req.params
    const { team_code, team_name } = req.body

    if (!team_code) {
      return res.status(400).json({
        success: false,
        message: 'Код команды не указан'
      })
    }

    client = await pool.connect()

    // Обновляем код команды и название команды у участника
    await client.query(`
      UPDATE members 
      SET team_code = $1, team_name = $2
      WHERE id = $3
    `, [team_code, team_name || null, id])

    res.json({
      success: true,
      message: 'Команда участника успешно изменена'
    })
  } catch (error) {
    console.error('Error changing member team:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при изменении команды участника: ' + error.message
    })
  } finally {
    if (client) client.release()
  }
})

// GET /api/members/by-team-code/:teamCode - получить участников команды по коду команды
app.get('/api/members/by-team-code/:teamCode', async (req, res) => {
  try {
    const { teamCode } = req.params
    const decodedTeamCode = decodeURIComponent(teamCode)
    
    const result = await pool.query(`
      SELECT id, last_name, first_name, patronymic, team_code, role, COALESCE(archived,false) as archived
      FROM members 
      WHERE team_code = $1 AND COALESCE(archived,false) = false
      ORDER BY last_name, first_name
    `, [decodedTeamCode])
    
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error fetching team members:', err)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Настройка Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Endpoint для загрузки фото (для регистрации) - принимаем любые файлы
app.post('/api/upload', uploadPhoto.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не предоставлен'
      });
    }

    // Загружаем в Cloudinary (принимаем любые файлы)
    const uploadOptions = {
      folder: 'photos',
      overwrite: false,
      access_mode: 'public'
    };

    // Если это изображение, используем resource_type: 'image', иначе 'raw'
    if (req.file.mimetype.startsWith('image/')) {
      uploadOptions.resource_type = 'image';
    } else {
      uploadOptions.resource_type = 'raw';
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, uploadOptions);

    // Удаляем временный файл
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      photoUrl: uploadResult.secure_url
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    
    // Удаляем временный файл в случае ошибки
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        // Игнорируем ошибку удаления
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке фото: ' + error.message
    });
  }
});

app.post('/api/upload-homework', async (req, res) => {
  let client;
  try {
    console.log('Upload homework request received');
    
    const { file: base64File, filename = `homework-${Date.now()}.pdf`, homeworkTitle, teamCode, track, fileSize } = req.body;

    console.log('Received teamCode:', teamCode, 'Type:', typeof teamCode);
    console.log('Received track:', track);
    console.log('Received fileSize:', fileSize);

    if (!base64File) {
      return res.status(400).json({
        success: false,
        message: 'Файл не предоставлен'
      });
    }

    // Проверка размера файла (10MB для всех)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (fileSize && fileSize > maxSize) {
      return res.status(400).json({
        success: false,
        message: `Файл слишком большой. Максимальный размер: 10MB`
      });
    }

    console.log('File received, uploading to Cloudinary...');
    
    // Загружаем в Cloudinary через base64
    const uploadOptions = {
      resource_type: 'raw',
      folder: 'homeworks',
      format: 'pdf',
      public_id: `homework-${Date.now()}`,
      overwrite: false,
      access_mode: 'public'
    };
    
    const uploadResult = await cloudinary.uploader.upload(
      `data:application/pdf;base64,${base64File}`, 
      uploadOptions
    );

    console.log('Cloudinary upload successful:', uploadResult.secure_url);

    // Сохраняем в существующую таблицу homeworks
    client = await pool.connect();
    
    // Проверяем наличие поля track в таблице и добавляем его, если нужно
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='homeworks' AND column_name='track') THEN
          ALTER TABLE homeworks ADD COLUMN track TEXT;
        END IF;
      END $$;
    `);
    
    const insertQuery = track 
      ? `INSERT INTO homeworks (hw_name, file_url, status, team_code, track)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`
      : `INSERT INTO homeworks (hw_name, file_url, status, team_code)
         VALUES ($1, $2, $3, $4)
         RETURNING id`;
    
    // Нормализуем teamCode: принимаем строку или число, убираем пробелы, проверяем на пустоту
    let finalTeamCode = null;
    if (teamCode !== null && teamCode !== undefined) {
      const teamCodeStr = String(teamCode).trim();
      if (teamCodeStr !== '' && teamCodeStr !== 'null' && teamCodeStr !== 'undefined') {
        finalTeamCode = teamCodeStr;
      }
    }
    console.log('Saving homework with teamCode:', finalTeamCode, 'track:', track, 'original teamCode:', teamCode, 'type:', typeof teamCode);
    
    // Проверяем, что teamCode обязателен для всех домашних заданий (кроме промежуточного воркшопа, если он без команды)
    if (!finalTeamCode) {
      return res.status(400).json({
        success: false,
        message: 'Код команды обязателен для загрузки домашнего задания. Убедитесь, что вы являетесь участником команды.'
      });
    }
    
    const insertValues = track 
      ? [homeworkTitle, uploadResult.secure_url, 'uploaded', finalTeamCode, track]
      : [homeworkTitle, uploadResult.secure_url, 'uploaded', finalTeamCode];
    
    const insertResult = await client.query(insertQuery, insertValues);

    const homeworkId = insertResult.rows[0].id;

    console.log('Homework saved to database with ID:', homeworkId);

    // Если это промежуточный воркшоп и указан трек, обновляем track для всех участников команды и для команды
    if (homeworkTitle === 'Промежуточный ВШ' && track && finalTeamCode) {
      try {
        // Проверяем наличие поля track в таблице members и добавляем его, если нужно
        await client.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='track') THEN
              ALTER TABLE members ADD COLUMN track TEXT;
            END IF;
          END $$;
        `);

        // Проверяем наличие поля track в таблице teams и добавляем его, если нужно
        await client.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='track') THEN
              ALTER TABLE teams ADD COLUMN track TEXT;
            END IF;
          END $$;
        `);

        // Обновляем track для всех участников команды
        const updateMembersResult = await client.query(
          `UPDATE members 
           SET track = $1 
           WHERE team_code = $2 AND COALESCE(archived, false) = false`,
          [track, finalTeamCode]
        );
        console.log(`Updated track for ${updateMembersResult.rowCount} members in team ${finalTeamCode}`);

        // Обновляем track для команды
        const updateTeamsResult = await client.query(
          `UPDATE teams 
           SET track = $1 
           WHERE code = $2`,
          [track, finalTeamCode]
        );
        console.log(`Updated track for team ${finalTeamCode}: ${updateTeamsResult.rowCount} row(s) affected`);
      } catch (updateError) {
        console.error('Error updating track for team members and team:', updateError);
        // Не прерываем выполнение, так как домашнее задание уже сохранено
      }
    }

    res.json({
      success: true,
      message: 'Файл успешно загружен и сохранен в базе данных',
      data: {
        homeworkId: homeworkId,
        fileUrl: uploadResult.secure_url,
        fileName: filename,
        fileSize: uploadResult.bytes,
        publicId: uploadResult.public_id
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке файла: ' + error.message
    });
  } finally {
    if (client) client.release();
  }
});

// GET /api/homeworks/by-team-code/:teamCode - получить домашние задания команды по коду команды
app.get('/api/homeworks/by-team-code/:teamCode', async (req, res) => {
  let client;
  try {
    const { teamCode } = req.params
    console.log('Received teamCode param:', teamCode)
    
    let decodedTeamCode
    try {
      decodedTeamCode = decodeURIComponent(teamCode)
    } catch (decodeError) {
      // Если декодирование не удалось, используем исходное значение
      decodedTeamCode = teamCode
      console.warn('Failed to decode teamCode, using original:', decodeError)
    }
    
    console.log('Decoded teamCode:', decodedTeamCode)
    
    client = await pool.connect();
    const result = await client.query(`
      SELECT id, hw_name, file_url, status, team_code, mark, comment
      FROM homeworks 
      WHERE team_code = $1
      ORDER BY id DESC
    `, [decodedTeamCode])
    
    console.log('Found homeworks:', result.rows.length)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error fetching team homeworks:', err)
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message })
  } finally {
    if (client) client.release();
  }
})

// GET /api/homeworks/uploaded - получить все домашние задания со статусом uploaded
app.get('/api/homeworks/uploaded', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(`
      SELECT id, hw_name, file_url, status, team_code
      FROM homeworks 
      WHERE status = 'uploaded'
      ORDER BY id DESC
    `)
    
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error fetching uploaded homeworks:', err)
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message })
  } finally {
    if (client) client.release();
  }
})

// PUT /api/homeworks/:id/review - обновить домашнее задание после проверки
app.put('/api/homeworks/:id/review', async (req, res) => {
  let client;
  try {
    const { id } = req.params
    const { mark, comment } = req.body
    
    // Проверяем наличие полей mark и comment в таблице, если нет - добавляем
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='homeworks' AND column_name='mark') THEN
          ALTER TABLE homeworks ADD COLUMN mark INTEGER;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='homeworks' AND column_name='comment') THEN
          ALTER TABLE homeworks ADD COLUMN comment TEXT;
        END IF;
      END $$;
    `)
    
    client = await pool.connect();
    const result = await client.query(`
      UPDATE homeworks 
      SET status = 'reviewed', mark = $1, comment = $2
      WHERE id = $3
      RETURNING id, hw_name, file_url, status, team_code, mark, comment
    `, [mark, comment || null, id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Homework not found' })
    }
    
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error reviewing homework:', err)
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message })
  } finally {
    if (client) client.release();
  }
})

// Обслуживание загруженных файлов
app.use('/uploads', express.static('uploads'));

app.get('/api/check-cloudinary', async (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    
    res.json({
      success: true,
      cloudinary: {
        configured: !!(cloudName && apiKey),
        cloudName: cloudName,
        apiKey: apiKey ? `***${apiKey.slice(-4)}` : 'not set',
        apiSecret: process.env.CLOUDINARY_API_SECRET ? '***set***' : 'not set'
      }
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/mero-reg - регистрация на мероприятие
app.post('/api/mero-reg', async (req, res) => {
  let client;
  try {
    const {
      mero,
      last_name,
      first_name,
      patronymic,
      email,
      team_code,
      pos,
      passport,
      team_name,
      date,
      comment
    } = req.body;

    // Проверка обязательных полей
    if (!mero || !last_name || !first_name || !email || !pos || !passport) {
      return res.status(400).json({
        success: false,
        message: 'Не все обязательные поля заполнены'
      });
    }

    client = await pool.connect();

    // Проверяем, не зарегистрирован ли уже пользователь на это мероприятие по паспорту
    // Нормализуем паспорт для сравнения (убираем пробелы)
    const normalizedPassport = passport.replace(/\s+/g, '');
    const checkQuery = `
      SELECT id FROM "mero-reg"
      WHERE mero = $1 
        AND REPLACE(passport, ' ', '') = $2
    `;
    const checkResult = await client.query(checkQuery, [mero, normalizedPassport]);
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Вы уже зарегистрированы на это мероприятие'
      });
    }

    // Вставка данных в таблицу mero-reg (имя таблицы с дефисом нужно заключать в кавычки)
    const query = `
      INSERT INTO "mero-reg" (
        mero, last_name, first_name, patronymic, email, team_code, pos, passport, team_name, date, comment
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `;

    // Преобразуем date в строку, если это массив
    const dateValue = Array.isArray(date) ? date.join(', ') : (date || null);

    const values = [
      mero,
      last_name,
      first_name,
      patronymic || null,
      email,
      team_code || null,
      pos,
      passport,
      team_name || null,
      dateValue,
      comment || null
    ];

    const result = await client.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Регистрация на мероприятие успешно сохранена',
      data: { id: result.rows[0].id }
    });
  } catch (error) {
    console.error('Error saving event registration:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при сохранении регистрации',
      error: error.message
    });
  } finally {
    if (client) client.release();
  }
});

const port = process.env.PORT || 3001
app.listen(port, () => {
  // server started
})


