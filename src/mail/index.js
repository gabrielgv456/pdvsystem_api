const nodemailer = require('nodemailer')
const SMTP_CONFIG = require('../config/smtp')

const transporter = nodemailer.createTransport({
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: false,
    auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.pass
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = async function sendEmail(email,codVerify,ownerName){
    const mailSent = await transporter.sendMail({
        subject: `Verificação de e-mail - Smart Store - Código ${codVerify}`,
        from: 'No-reply Smart Store',
        to: email,
        html: `
        <html>
            <body>
                Seu código de verificação é: <b> ${codVerify} </b> 
                <br/><br/>
                Hey, ${ownerName}, estamos muito contente que tenha interesse nos nossos serviços. Confirme agora seu e-mail para que possa ter acesso a plataforma!<br/>
                <br/><br/>
                Abraços, equipe Smart Store ♡ <br/>

            </body>
        </html>
        `
    })
    console.log(mailSent)
}