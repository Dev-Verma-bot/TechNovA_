const nodemailer = require("nodemailer");
const {
  MAIL_HOST,
  MAIL_USER,
  MAIL_PASS,
  BREVO_API_KEY,
  SENDER_EMAIL,
} = require("../Configuration/env_config");

const getMailPort = () => {
  const raw = String(process.env.MAIL_PORT || "465").trim();
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 465;
};

const getMailSecure = (port) => {
  if (process.env.MAIL_SECURE !== undefined) {
    return String(process.env.MAIL_SECURE).trim().toLowerCase() === "true";
  }
  return port === 465;
};

const getTransporter = () => {
  if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
    throw new Error("Mail configuration is missing (MAIL_HOST, MAIL_USER, MAIL_PASS)");
  }

  const port = getMailPort();
  const secure = getMailSecure(port);

  return nodemailer.createTransport({
    host: MAIL_HOST,
    port,
    secure,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });
};

const sendViaBrevo = async (email, subject, text, html) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": BREVO_API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: {
        name: "CredNova",
        email: SENDER_EMAIL || MAIL_USER || "no-reply@crednova.com"
      },
      to: [
        {
          email: email
        }
      ],
      subject: subject,
      htmlContent: html,
      textContent: text
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Brevo API Error: ${errorData.message || response.statusText}`);
  }
};

const getOtpEmailHtml = (otp, purpose) => {
  const title = purpose === "password-reset" ? "Reset Your Password" : "Confirm Your Registration";
  const actionText = purpose === "password-reset" ? "resetting your password" : "creating your account";
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #0f172a;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">CredNova</h1>
              <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px;">Explainable Credit Decisioning</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px; text-align: center;">
              <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 700;">${title}</h2>
              <p style="margin: 0 0 32px 0; color: #475569; font-size: 14px; line-height: 1.6; font-weight: 500;">
                You are receiving this email because you initiated ${actionText} with CredNova. Please use the verification code below to complete the process.
              </p>
              
              <!-- OTP Box -->
              <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px dashed #cbd5e1; display: inline-block; width: 80%;">
                <div style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #2563eb; font-family: 'Courier New', Courier, monospace; margin-left: 6px;">${otp}</div>
              </div>
              
              <p style="margin: 0 0 8px 0; color: #ef4444; font-size: 13px; font-weight: 700;">
                ⚠️ This code expires in 10 minutes.
              </p>
              <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 500;">
                Do not share this code with anyone. CredNova staff will never ask for your verification code.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 11px; line-height: 1.4; font-weight: 500;">
                This is an automated security message from CredNova. If you did not request this registration, you can safely ignore this email.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px; font-weight: 600;">
                &copy; 2026 CredNova Inc. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

const getSuccessEmailHtml = (email, purpose) => {
  const title = purpose === "password-reset" ? "Password Reset Successful" : "Welcome to CredNova!";
  const message = purpose === "password-reset" 
    ? "Your CredNova account password was successfully reset. If you did not perform this action, please contact our support security team immediately."
    : "Your CredNova account has been successfully created. You can now log in, submit loan applications, and explore explainable credit scoring model results.";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #0f172a;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">CredNova</h1>
              <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px;">Explainable Credit Decisioning</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px; text-align: center;">
              <div style="width: 56px; height: 56px; line-height: 56px; background-color: #d1fae5; color: #059669; border-radius: 50%; font-size: 28px; font-weight: bold; margin: 0 auto 24px auto; text-align: center; display: inline-block;">✓</div>
              <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 700;">${title}</h2>
              <p style="margin: 0 0 32px 0; color: #475569; font-size: 14px; line-height: 1.6; font-weight: 500;">
                ${message}
              </p>
              <a href="https://cred-nova.netlify.app" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 10px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 14px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">Launch Platform</a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 11px; line-height: 1.4; font-weight: 500;">
                This is a transactional security alert from CredNova. If you need any assistance, contact our technical team.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px; font-weight: 600;">
                &copy; 2026 CredNova Inc. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

exports.sendOtpEmail = async (email, otp, purpose = "verification") => {
  const subject =
    purpose === "password-reset"
      ? "Your password reset OTP"
      : "Your signup OTP";

  const text =
    purpose === "password-reset"
      ? `Your password reset OTP is ${otp}. It expires in 10 minutes.`
      : `Your signup OTP is ${otp}. It expires in 10 minutes.`;

  const html = getOtpEmailHtml(otp, purpose);

  if (BREVO_API_KEY) {
    await sendViaBrevo(email, subject, text, html);
    return;
  }

  const transporter = getTransporter();
  await transporter.sendMail({
    from: MAIL_USER,
    to: email,
    subject,
    text,
    html
  });
};

exports.sendSuccessEmail = async (email, purpose = "signup") => {
  const subject =
    purpose === "password-reset"
      ? "Password Reset Successful"
      : "Registration Successful";

  const text =
    purpose === "password-reset"
      ? "Your password has been reset successfully. If this was not you, contact support immediately."
      : "Your account was created successfully. Welcome to CredNova.";

  const html = getSuccessEmailHtml(email, purpose);

  if (BREVO_API_KEY) {
    await sendViaBrevo(email, subject, text, html);
    return;
  }

  const transporter = getTransporter();
  await transporter.sendMail({
    from: MAIL_USER,
    to: email,
    subject,
    text,
    html
  });
};
