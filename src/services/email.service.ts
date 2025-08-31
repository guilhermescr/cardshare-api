import nodemailer from 'nodemailer';

export async function sendEmail(
  to: string,
  subject: string,
  username: string,
  confirmationUrl: string
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = getConfirmationEmailHtml(username, confirmationUrl);

  await transporter.sendMail({
    from: `"CardShare" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

function getConfirmationEmailHtml(username: string, confirmationUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
      <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; padding: 24px;">
        <h2 style="color: #2d7ff9;">Welcome to CardShare, ${username}!</h2>
        <p>Thank you for registering. Please confirm your email address to activate your account:</p>
        <a href="${confirmationUrl}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #2d7ff9; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Confirm Email
        </a>
        <p style="font-size: 13px; color: #888;">If you did not create this account, you can ignore this email.</p>
        <hr style="margin: 24px 0;">
        <p style="font-size: 12px; color: #bbb;">CardShare &copy; ${new Date().getFullYear()}</p>
      </div>
    </div>
  `;
}
