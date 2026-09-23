const otpEmailHTMLTemplate = ({
  name,
  otpCode,
  expiryMinutes = 10,
}: {
  name: string;
  otpCode: string;
  expiryMinutes?: number;
}) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f3f4f6;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 30px;
          text-align: center;
        }
        .header h2 {
          color: #10b981;
          font-size: 26px;
          margin: 0 0 10px;
          font-weight: 600;
        }
        .header p {
          font-size: 18px;
          color: #555;
          margin: 0 0 30px;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          color: #444;
          margin-bottom: 20px;
        }
        .otp-code {
          font-size: 28px;
          letter-spacing: 4px;
          font-weight: 700;
          color: #10b981;
          padding: 15px 30px;
          background-color: #ecfdf5;
          border: 1px dashed #a7f3d0;
          border-radius: 10px;
          display: inline-block;
          margin: 20px 0;
        }
        .security-note {
          font-size: 14px;
          color: #6b7280;
          background-color: #f9fafb;
          padding: 12px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .footer {
          font-size: 14px;
          color: #666;
          margin-top: 30px;
          line-height: 1.5;
        }
        .footer p {
          margin: 5px 0;
        }
        .footer a {
          color: #10b981;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Security Verification</h2>
          <p>Hello, ${name}</p>
        </div>
        <div class="content">
          <p>We received a request to access your HealthSync account. Please use the verification code below to proceed:</p>
          <div class="otp-code">${otpCode}</div>
          <p>This code will expire in <strong>${expiryMinutes} minutes</strong>. Please do not share this code with anyone.</p>
          <div class="security-note">
            If you didn't request this code, your account might be at risk. Please secure your account immediately.
          </div>
        </div>
        <div class="footer">
          <p>Stay healthy and safe!</p>
          <p>Best regards,<br />The HealthSync Security Team</p>
          <p><a href="https://healthsync.com">Visit our website</a> | <a href="mailto:support@healthsync.com">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

export default otpEmailHTMLTemplate;
