const mail = require("../utils/email");
class MailController {

    sendMailByList = async (req, res) => {
        const  {mailList, massage, subject}  = req.body
        if (!mailList) {
            return res.status(400).json({ message: 'no mail list' })
        }
        await mailList.map((to) => { mail.sendMail(to, subject, `${massage}
        http://localhost:3000/ICamera`) })

        res.json(`all mails are send`)
    }

}

const mailController = new MailController();
module.exports = mailController;