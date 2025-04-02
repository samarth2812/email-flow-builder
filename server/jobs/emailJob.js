const Agenda = require("agenda");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Initialize Agenda
const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: "agendaJobs" },
});

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password
  },
});

// Define the email sending job
agenda.define("send email", async (job) => {
  const { to, subject, body } = job.attrs.data;

  console.log(`📧 Sending email to ${to} in job ${job.attrs._id}`);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email successfully sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
});

// Start Agenda
(async function () {
  await agenda.start();
  console.log("🚀 Agenda started and ready for job processing.");
})();

module.exports = agenda;
