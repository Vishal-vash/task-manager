const sgMail = require("@sendgrid/mail");
const { model } = require("../models/task");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "vishal.vasishat@gmail.com",
    subject: "Welcome to Task Manager",
    text: `Hello ${name} this is a welcome mail from Task Manager Admins. This is a test email body text.`,
  });
};

module.exports = { sendWelcomeEmail }
