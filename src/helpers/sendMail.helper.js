const nodemailer = require("nodemailer");
const fs = require('file-system')
const path = require('path')
const Handlebars = require('handlebars')

const sendmail = (from,to,data)=>{

    let transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 465,
        secure: true,
        auth: {
          user: "apikey",
          pass: `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`,
        },
      });

      const readfile = fs.readFileSync(
        path.join(__dirname, "../email/gmail.html"),
        "utf-8"
      );
      const handlebarsTemplate = Handlebars.compile(readfile);
      const parsedHtml = handlebarsTemplate(data);

      let message = {
        from: from,
        to: to,
        subject: "I am sending a fake mail...",
        html: parsedHtml,
      };
      transporter.sendMail(message, (err, info) => {
        if (err) {
          // console.log("Error occurred. " + err);
        }
      //   console.log("Message sent:", info);
      });
}
module.exports = sendmail