const nodemailer = require('nodemailer')
const SMTP_CONFIG = require('../../config/smtp')

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

module.exports = async function sendEmailVerifyMail(email,codVerify,ownerName){
    const mailSent = await transporter.sendMail({
        subject: `Verificação de e-mail - Safyra - Código ${codVerify}`,
        from: 'no-reply@safyra.com.br',
        to: email,
        html: `
        <html>
            <body>
                Seu código de verificação é: <b> ${codVerify} </b> 
                <br/><br/>
                Hey, ${ownerName}, estamos muito contente que tenha interesse nos nossos serviços. Confirme agora seu e-mail para que possa ter acesso a plataforma!<br/>
                <br/><br/>
                Abraços, equipe Safyra ♡ <br/>

            </body>
        </html>
        `
    })
}

module.exports = async function sendEmailChangePass(email,codVerify,name){
    const mailSent = await transporter.sendMail({
        subject: `Recuperação de Senha - Safyra - Código ${codVerify}`,
        from: 'no-reply@safyra.com.br',
        to: email,
        html: `
        <html>
            <body>
                Seu código de verificação é: <b> ${codVerify} </b> 
                <br/><br/>
                Hey, ${name}, <br/><br/> Informe o código acima para poder alterar a sua senha agora mesmo!<br/>
                <br/><br/>
                Abraços, equipe Safyra ♡ <br/>

            </body>
        </html>
        `
    })
}