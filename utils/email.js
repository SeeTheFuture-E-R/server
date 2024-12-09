const nodemailer = require('nodemailer');

class Mail {
    static transporter = nodemailer.createTransport({
        service: 'gmail',  // or any other email service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD  // Use app-specific password for Gmail
        }
    });

    static async sendMail(to, subject, text) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: to,
                subject: subject,
                text: text,
                // You can also send HTML content using the html property:
                // html: '<h1>Hello</h1><p>Your content here</p>'
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.response);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

module.exports = Mail;