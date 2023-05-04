var nodemailer = require('nodemailer');

// https://support.google.com/mail/answer/185833?hl=iw

class Mail {

  sendMail = (to, subject, text) => {
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   name: 'Ester&Renana Zinger&Grilus',
    //   // host: "smtp.gmail.com",
    //   // port: 587,
    //   // secure: false,
    //   auth: {
    //     user: 'erseethefuture@gmail.com',
    //     pass: 'tx,r&rbbv9660'
    //   }
    // });
    const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: '36325266906@mby.co.il',
        pass: 'Student@264'
      }
    });


    const mailOptions = {
      from: transporter,
      to: to,
      subject: subject,
      text: text,
    }
try{
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } 
      else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  catch(err){
    console.log(err)
  }
  }
}

const mail = new Mail()
module.exports = mail

// https://support.google.com/mail/answer/185833?hl=iw