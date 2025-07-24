const sgMail = require('../configs/sendgrid.config');

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      to,
      from: process.env.SENDER_EMAIL, // This email must be verified with SendGrid
      subject,
      ...(text && { text }),
      ...(html && { html }),
    };

    const [response] = await sgMail.send(mailOptions);
    console.log('Email sent with status code:', response.statusCode);
  } catch (error) {
    console.error('Error sending email: ', error.response?.body || error.message);
    const newError = new Error('Unable to send email!');
    newError.code = 500;
    throw newError;
  }
};

module.exports = { sendEmail };
