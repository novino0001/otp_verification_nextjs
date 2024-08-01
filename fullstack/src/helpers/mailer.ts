import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';


export const sendEmail = async ({email, emailType , userId }:any) => {
     try {
        const hashedToken =  await bcryptjs.hash(userId.toString(),10)
        if(emailType === 'VERYFY'){
           
            await User.findByIdAndUpdate(userId,
                 {verifyToken:hashedToken},
                {verifyTokenExpiration:Date.now()+3600000});
           
        }
        else if(emailType === 'FORGOT'){
            await User.findByIdAndUpdate(userId,
                {forgotPasswordToken:hashedToken},
               {forgotPasswordTokenExpiration:Date.now()+3600000});
        }
       

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "e6e3409cbc9bfd",
              pass: "67b5d57df4dd0a"
            }
        
});
 const mailOptions = {
    from: 'naveensharma.cse23@jecrc.ac.in', // sender address
    to: email, // list of receivers
    subject:  emailType === 'VERYFY' ? "Verify your email" : "Reset your Password", // Subject line
    
    html:  `<p> Click <a href = "${process.env.DOMAIN}/verifyemail?token = ${hashedToken}" > here </a> to ${emailType==="VERIFY" ? "verify your email"
        : "reset your password"}. .</p>
             <p>This link will expire in 1 hour.</p>
              
             <p>Thank you</p>`
            
    
}

const mailResponse = await transport.sendMail(mailOptions);
return mailResponse
// async..await is not allowed in global scope, must use a wrapper


     }
     catch (error) {
         console.error('Error sending email', error);
         throw new Error('Failed to send email');
     }  
}