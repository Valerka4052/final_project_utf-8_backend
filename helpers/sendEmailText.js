const emailTextRegister = (verificationCode) => {
  return `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Email Verification</title>
</head>

<body>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Welcome!</h2>
        <p>Thank you for registering on our website. To complete the registration process, please verify your email
            address by clicking the button below:</p>
        <div style="text-align: center; padding: 20px;">
            <a href="https://villiav.github.io/final_project_utf-8_front/?verificationCode=${verificationCode}" style="display: inline-block; background-color: #007BFF; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        </div>
        <p>If you didn't register on our website, simply ignore this email.</p>
        <p>Best regards,<br>The Website Team</p>
    </div>
</body>

</html>`;
};

module.exports = emailTextRegister;
