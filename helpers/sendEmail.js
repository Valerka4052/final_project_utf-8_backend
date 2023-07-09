const sgMail = require("@sendgrid/mail");

SENDGRID_API_KEY =
  "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";

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "infernokgg@gmail.com" };
  await sgMail.send(email);
  return true;
};

module.exports = sendEmail;
