import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { correo, token } = body;

    if (!correo || !token) {
      return NextResponse.json({ error: 'Faltan datos requeridos.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'lehabimgroup2@gmail.com',
        pass: 'oqgtzpemobfqmvmi',
      },
    });

    const verificationLink = `http://localhost:3000/verificar?token=${token}&correo=${correo}`;
    const mailOptions = {
      from: 'lehabimgroup2@gmail.com',
      to: correo,
      subject: 'Verifica tu cuenta',
      text: `Por favor, verifica tu cuenta haciendo clic en el siguiente enlace: ${verificationLink}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Correo enviado correctamente.' });
  } catch (error) {
    console.error('Error en el envío:', error);
    return NextResponse.json({ error: 'No se pudo enviar el correo.' }, { status: 500 });
  }
}