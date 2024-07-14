import { createTransport } from "nodemailer";



const transporter = createTransport({
service:"gmail",
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
});


const sendEmail= async (to, subject, html)=> {
 
  const info = await transporter.sendMail({
    from: `${process.env.user} <${process.env.email}>`, 
    to:to ? to:"",
    subject: subject ? subject:"",
    text: "please click the link down below to confirm your email address",
    html: html? html:""
  });

  if(info.accepted.length){
    return true;
  }
  return false;
}
export default sendEmail