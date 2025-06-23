"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resetPasswordEmailTemplate = ({ name, resetLink, }) => `<!DOCTYPE html>
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
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #FFFFFF;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #ddd;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #007bff; /* Theme primary main */
        }
        .content {
          padding: 20px;
        }
        .content p {
          font-size: 16px;
          line-height: 1.5;
          color: #4A5568;
        }
        .content a {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 10px;
          transition: background-color 0.3s ease;
        }
        .content a:hover {
          background-color: #0056b3;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #aaa;
        }
        .footer a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>We received a request to reset your password. If you made this request, please click the link below to reset your password:</p>
          <p>
            <a href=${resetLink}>Reset Your Password</a>
          </p>
          <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
          <p>Thank you,</p>
          <p>The Medic Panda Team</p>
        </div>
        <div class="footer">
          <p>If you have any issues, feel free to contact our support team at <a href="mailto:support@MedicPanda">support@MedicPanda</a>.</p>
        </div>
      </div>
    </body>
    </html>
    `;
exports.default = resetPasswordEmailTemplate;
