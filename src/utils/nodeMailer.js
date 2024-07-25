import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "mykhararpg@gmail.com",
        pass:"ihbu sdmt bvtq ckxt"
    }
});

const mailUser = (receiverMail, subject, message) => {
    const mailOptions = {
        from: "mykhararpg@gmail.com",
        to: receiverMail,
        subject: subject,
        html: message
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export { mailUser };