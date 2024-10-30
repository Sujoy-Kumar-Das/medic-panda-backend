const sendOtpEmailTemplate = ({
  name,
  otpCode,
}: {
  name: string;
  otpCode: string;
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
          color: #0d6efd;
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
          font-size: 24px;
          font-weight: 700;
          color: #0d6efd;
          padding: 15px 30px;
          background-color: #f0f4fb;
          border: 1px dashed #b0c5ff;
          border-radius: 10px;
          display: inline-block;
          margin: 20px 0;
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
          color: #0d6efd;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome to Medic Panda, ${name}!</h2>
          <p>Your trusted partner in health and wellness.</p>
        </div>
        <div class="content">
          <p>To verify your account, please use the following One-Time Password (OTP):</p>
          <div class="otp-code">${otpCode}</div>
          <p>This code is valid for a limited time. Please enter it promptly to complete your verification.</p>
          <p>If you did not request this, please disregard this email.</p>
        </div>
        <div class="footer">
          <p>Thank you for choosing Medic Panda! We're thrilled to have you on board.</p>
          <p>Best regards,<br />The Medic Panda Team</p>
          <p><a href="https://medicpanda.com">Visit our website</a> | <a href="mailto:support@medicpanda.com">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

export default sendOtpEmailTemplate;
