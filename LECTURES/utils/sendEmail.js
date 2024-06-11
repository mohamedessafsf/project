const nodeMailer = require('nodemailer');


const sendEmail = async (options) => {

    // 1) create transporter (service that send email like [gmail, mailgun, mailtrap])

    const transporter = nodeMailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "01a54151663954",
          pass: "9fe49e0b68f24d"
        }
      });

    // 2) define email options (like from, to, subject, content)
    const mailOptions = {
        from: 'E-shop App <elsayadmohamed94@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    // 3) send email
    await transporter.sendMail(mailOptions);


};


module.exports = sendEmail;