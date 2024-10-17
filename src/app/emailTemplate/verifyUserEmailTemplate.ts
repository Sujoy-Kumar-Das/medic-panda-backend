const verifyUserEmailTemplate = ({
  name,
  emailVerificationLink,
}: {
  name: string;
  emailVerificationLink: string;
}) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #F4F6F8;
          margin: 0;
          padding: 0;
          color: #2D3748;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #FFFFFF;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
          text-align: center;
        }
        .header h2 {
          color: #007bff;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          font-size: 16px;
          line-height: 1.5;
          color: #4A5568;
          margin-bottom: 20px;
        }
        .content a {
          display: inline-block;
          padding: 12px 20px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }
        .content a:hover {
          background-color: #0056b3;
        }
        .footer {
          font-size: 14px;
          color: #777;
          margin-top: 20px;
        }
        .footer a {
          color: #ffff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome to Medic Panda, ${name}!</h2>
        </div>
        <div class="content">
          <p>We're thrilled to have you with us! Please confirm your email address to get started:</p>
          <a href="${emailVerificationLink}">Verify Your Email</a>
          <p>If the button doesn’t work, copy and paste the following link into your browser:</p>
          <p class="footer">
            <a href="${emailVerificationLink}">${emailVerificationLink}</a>
          </p>
          <p>Thank you for choosing Medic Panda. We're excited to have you on board!</p>
          <p>Best regards,<br />The Medic Panda Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

export default verifyUserEmailTemplate;
