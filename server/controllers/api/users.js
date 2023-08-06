const router = require('express').Router();
const { User } = require('../../models');
require('dotenv').config();
// const nodemailer = require('nodemailer');
// // Nodemailer transporter setup
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'tokiliaac@gmail.com',
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // Route to send the email
// app.get('/send-email', (req, res) => {
//   const mailOptions = {
//     from: 'your@gmail.com',
//     to: 'recipient@example.com',
//     subject: 'Test Email from Nodemailer with Handlebars',
//     // Use the 'email-template' Handlebars view to generate the email content
//     html: hbs.render('email-template', { name: 'Recipient', message: 'Hello from Nodemailer and Handlebars!' }),
//   };

//   // Send the email
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error:', error);
//       return res.status(500).json({ error: 'Failed to send email.' });
//     } else {
//       console.log('Email sent:', info.response);
//       return res.json({ message: 'Email sent successfully.' });
//     }
//   });
// });

// New user
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Get all users, why not?
router.get('/', async (req, res) => {
  try {
    const userData = await User.findAll();

      res.status(200).json(userData);
    
  } catch (err) {
    res.status(400).json(err);
  }
});

// Action login
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.username } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

// Action logout
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;