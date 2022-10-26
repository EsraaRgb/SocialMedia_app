import nodemailer from "nodemailer";

export default async function myEmail(dest, subject, message,attachments) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Email,
      pass: process.env.Password,
    },
  });

  let info = await transporter.sendMail({
    from: `Blogy <${process.env.SenderPassword}>`,
    to: dest,
    subject: subject,
    html:message,
    attachments
  });
  console.log(info);
}
