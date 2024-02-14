//@ts-check

import { createTransport } from 'nodemailer'
import { host as _host, port as _port, user as _user, pass as _pass } from '../../config/smtp.js'

const transporter = createTransport({
    host: _host,
    port: _port,
    secure: false,
    auth: {
        user: _user,
        pass: _pass
    },
    tls: {
        rejectUnauthorized: false
    }
})

export async function sendEmailVerifyMail(email,codVerify,ownerName){
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

export async function sendEmailChangePass(email,codVerify,name){
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