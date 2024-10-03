const emailVerificationBody = (emailVerificationLink: string) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px;">
    <h2 style="color: #333;">Welcome to Medic Panda!</h2>
    <p style="font-size: 16px; color: #555;">
      We're excited to have you on board! To ensure the security of your account and to enhance your experience, we kindly ask you to verify your email address.
    </p>
    <p style="font-size: 16px; color: #555;">
      Simply click the button below to confirm your email address:
    </p>
    <a href="${emailVerificationLink}" style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">
      Verify Your Email
    </a>
    <p style="font-size: 14px; color: #777; margin-top: 20px;">
      If the button above doesn’t work, you can also copy and paste the following link into your browser:<br>
      <a href="${emailVerificationLink}" style="color: #007bff;">${emailVerificationLink}</a>
    </p>
    <p style="font-size: 16px; color: #555;">
      Thank you for being a part of Medic Panda!<br />
      We look forward to serving you.
    </p>
    <p style="font-size: 16px; color: #555;">
      Best regards,<br />
      The Medic Panda Team
    </p>
  </div>
`;

export default emailVerificationBody;
