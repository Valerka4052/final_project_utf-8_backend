const nodemailer = require("nodemailer");
require('dotenv').config();
const { EMAIL_PASS} = process.env;
const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: "soyummybest@ukr.net",
    pass: EMAIL_PASS,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "soyummybest@ukr.net" };
  try {
    await transport.sendMail(email);

    return "Ok";
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = sendEmail;
