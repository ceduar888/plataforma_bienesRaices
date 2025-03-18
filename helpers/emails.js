import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {nombre, email, token} = datos

      //Enviando email
      await transport.sendMail({
        from: '"Bienes Raíces" <no-reply@bienesraices.com>',
        to: email,
        subject: 'Confirmación de cuenta',
        text: `Hola ${nombre}, confirma tu cuenta en Bienes Raíces.
    
        Confirma tu cuenta en el siguiente enlace: ${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}
    
        Si tú no creaste una cuenta en Bienes Raíces, ignora este email.`,
        html: `
            <p>Hola ${nombre}, confirma tu cuenta en <strong>Bienes Raíces</strong></p>
            
            <p>Confirma tu cuenta en el siguiente enlace: <br> 
            <a href="${process.env.BACKEND_URL}${process.env.PORT ? `:${process.env.PORT}` : ''}/auth/confirmar/${token}" target="_blank">
            Confirmar cuenta</a></p>
    
            <p>Si tú no creaste una cuenta en Bienes Raíces, ignora este email.</p>
        `
    });

}

const emailRecuperarPassword = async (datos) => {

  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const {nombre, email, token} = datos

    //Enviando email
    await transport.sendMail({
      from: '"Bienes Raíces" <no-reply@bienesraices.com>',
      to: email,
      subject: 'Restablece tu contraseña en Bienes Raíces',
      text: `Hola ${nombre}, has solicitado restablecer tu contraseña.
  
      Para restablecer tu contraseña, ingresa al siguiente enlace: 
      ${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}
  
      Si no solicitaste restablecer tu contraseña, ignora este mensaje.`,
      html: `
        <p>Hola <strong>${nombre}</strong>, has solicitado restablecer tu contraseña en <strong>Bienes Raíces</strong>.</p>
        
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
        <p>
          <a href="${process.env.BACKEND_URL}${process.env.PORT ? `:${process.env.PORT}` : ''}/auth/olvide-password/${token}" target="_blank" 
             style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">
             Restablecer Contraseña
          </a>
        </p>
  
        <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje.</p>
      `
    });

}

export {
    emailRegistro,
    emailRecuperarPassword
}