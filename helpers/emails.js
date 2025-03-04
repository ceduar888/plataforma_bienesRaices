import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {nombre, email, token} = datos

      //Enviando email
      await transport.sendMail({
        from: 'bienesraices.com',
        to: email,
        subject: 'Confirmacion de cuenta',
        text: 'Confirma tu cuenta',
        html: `
            <p>Hola ${nombre}, confirma tu cuenta en bienesraices.com</p>
            
            <p>Confirma tu cuenta en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a></p>

            <p>Si tu no creaste una cuenta en bienesraices.com, ignora este email</p>
        `
      })

}

const emailRecuperarPassword = async (datos) => {

  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const {nombre, email, token} = datos

    //Enviando email
    await transport.sendMail({
      from: 'bienesraices.com',
      to: email,
      subject: 'Restablece tu password de bienesraices.com',
      text: 'Restablece tu password de bienesraices.com',
      html: `
          <p>Hola ${nombre}, has solicitado restablecer tu password de bienesraices.com</p>
          
          <p>Entra en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Restablecer Password</a></p>

          <p>Si tu no solicitaste restablecer password en bienesraices.com, ignora este email</p>
      `
    })

}

export {
    emailRegistro,
    emailRecuperarPassword
}