import nodemailer from "nodemailer";

const Email = async (options) => {
  const transpoter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5ee7b11d0752f6",
      pass: "28157e1eee9d5f",
    },
  });
  const mailOptions = {
    from: "Kevin Caster <caster@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<h1>Reset token <a href=${options.url}>Click Here</a></h1>`,
  };

  await transpoter.sendMail(mailOptions);
};
export default Email;
