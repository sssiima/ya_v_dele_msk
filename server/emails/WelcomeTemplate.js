const getWelcomeTemplate = (user) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #40BFBF; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #40BFBF; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Добро пожаловать!</h1>
          </div>
          <div class="content">
            <h2>Здравствуйте, ${user.first_name}!</h2>
            <p>Благодарим за регистрацию в нашем сервисе. Ваш аккаунт успешно создан.</p>
            <p><strong>Данные для входа:</strong></p>
            <ul>
              <li>Email: ${user.username}</li>
            </ul>
            <p>Если вы не регистрировались, проигнорируйте это письмо.</p>
          </div>
          <div class="footer">
            <p>© Я в деле — программа развития молодёжного предпринимательства, 2025</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  module.exports = { getWelcomeTemplate };