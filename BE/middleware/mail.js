const nodemailer = require("nodemailer");



const sendEmail=async(mail)=>{
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'easter.schimmel49@ethereal.email',
            pass: 'jMRVUMkSSxXHFjDzWm'
        }
    });
    
     // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'easter.schimmel49@ethereal.email', // sender address
    to: `lubnaksr1997@gmail.com`, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });
  
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  sendEmail().catch(console.error);

}



module.exports={
    sendEmail
}