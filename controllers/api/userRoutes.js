require('dotenv').config();
const nodemailer = require('nodemailer');
// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'tokiliaac@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Route to send the email
app.get('/send-email', (req, res) => {
  const mailOptions = {
    from: 'your@gmail.com',
    to: 'recipient@example.com',
    subject: 'Test Email from Nodemailer with Handlebars',
    // Use the 'email-template' Handlebars view to generate the email content
    html: hbs.render('email-template', { name: 'Recipient', message: 'Hello from Nodemailer and Handlebars!' }),
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
      return res.status(500).json({ error: 'Failed to send email.' });
    } else {
      console.log('Email sent:', info.response);
      return res.json({ message: 'Email sent successfully.' });
    }
  });
});