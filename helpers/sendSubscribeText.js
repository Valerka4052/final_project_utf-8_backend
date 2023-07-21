const emailTextSubscription = () => {
  return ` <!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Subscription Confirmation</title>
</head>

<body>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Welcome to our newsletter!</h2>
        <p>Thank you for subscribing to our newsletter. You will now receive the latest news and updates from us.</p>
        <p>If you accidentally subscribed, simply ignore this email.</p>
        <p>Best regards,<br>The Website Team</p>
    </div>
</body>

</html>`;
};

module.exports = emailTextSubscription;
