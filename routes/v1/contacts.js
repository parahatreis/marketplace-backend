const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");

// @route POST v1/contacts/send-email
// @desc Send email
// @access Public
router.post('/send-email', async (req, res) => {
  const {
    user_name,
    user_email,
    user_message
  } = req.body;

  if(!user_name) return res.json({
    status: 400,
    msg: 'Please input name'
  });
  if (!user_email) return res.json({
    status: 400,
    msg: 'Please input email'
  });
  if (!user_message) return res.json({
    status: 400,
    msg: 'Please input message'
  });

  // Send message with nodemailer
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      // host: 'mr.parahat28@gmail.com',
      // port: 587,
      // secure: false, // true for 465, false for other ports
      auth: {
        user: '', // generated ethereal user
        pass: '', // generated ethereal password
      },
      // tls: {
      //   rejectUnauthorized: false
      // }
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: '"ISLEGTM" <mr.parahat28@gmail.com>', // sender address
      to: "msapayev2@gmail.com", // list of receivers
      subject: `Message | ISLEGTM`, // Subject line
      // text: "Bu hat islegtm tarapyndan ugradyldy", // plain text body
      html: `
            <p style='font-size: 20px'>${user_message}</p>
            <p>Ady: ${user_name}</p>
            <p>Email: ${user_email}</p>
          `, // html body
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: 500,
      msg: error,
      obj: req.body
    });
  }

  
  return res.json({
    status: 200,
    msg: 'success',
    obj: req.body
  });
});

module.exports = router;