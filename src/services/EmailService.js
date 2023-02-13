require('dotenv').config();
const nodemailer = require("nodemailer");

let sendSimpleEmail = async(data)=>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        user: process.env.EMAIL_APP, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

  // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Swolf-Heathy 👻" <toiphamasi79@gmail.com>', // sender address
        to: data.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        text: "Hello world?", // plain text body
        html:buildHtml(data), // html body
    });
}

let buildHtml = (data)=>{
    let message = data.language === 'vi' ?
    `
        <h3>Xin chào ${data.fullName} !</h3>
        <p>Bạn đã nhận được email này vì đã dặt lịnh khánh bệnh trên Booking của Swolf-dev</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${data.time}</b></div>
        <div><b>Bác sĩ: ${data.doctorName}</b></div>
        <p>Vui lòng click vào link bên dưới để xác nhận hoàn tất dịch vụ đặt lịch khám bệnh.</p>
        <div><a href=${data.redirectLink} target="_blank">Click here<a></div>
        <div>Xin chân thành cảm ơn!</div>
    `:
    `
        <h3>Hi ${data.fullName}</h3>
        <p>You received this email because you booked a sick appointment on Swolf-dev's Booking</p>
        <p>Information to book a medical appointment:</p>
        <div><b>Time: ${data.time}</b></div>
        <div><b>Doctor: ${data.doctorName}</b></div>
        <p>Please click on the link below to confirm the completion of the medical appointment booking service.</p>
        <div><a href=${data.redirectLink} target="_blank">Click here<a></div>
        <div>Sincerely thank!</div>
    `
    return message;
}

let sendAttactment = async(data)=>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        user: process.env.EMAIL_APP, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

  // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Swolf-Heathy 👻" <toiphamasi79@gmail.com>', // sender address
        to: data.email, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        text: "Hello world?", // plain text body
        html:buildHtmlAttacment(data), // html body
        attachments:[
            {   // encoded string as an attachment
                filename: `remedy-${data.patientFirstName}-${data.patientLastName}-${data.date}.jpg`,
                content: data.imageBase64.split('base64,')[1],
                encoding: 'base64'
            }
        ]
    });
}

let buildHtmlAttacment = (data)=>{
    let message = data.language === 'vi' ?
    `
        <h3>Xin chào ${data.patientFirstName} ${data.patientLastName}  !</h3>
    `:
    `
        <h3>Hi ${data.patientLastName} ${data.patientFirstName} !</h3>
        
    `
    return message;
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttactment: sendAttactment,
}