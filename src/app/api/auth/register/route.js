import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { nombre, apellidos, correo, password, repetirPassword, token } = await request.json();

    // Validar datos
    if (!nombre || !apellidos || !correo || !password || !repetirPassword || !token) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Validar el dominio del correo
    if (!correo.endsWith('@estudiantes.uv.mx')) {
      return NextResponse.json({ error: 'El correo debe tener la terminación @estudiantes.uv.mx' }, { status: 400 });
    }

    // Validar que las contraseñas coincidan
    if (password !== repetirPassword) {
      return NextResponse.json({ error: 'Las contraseñas no coinciden' }, { status: 400 });
    }

    // Verificar si el correo ya está registrado
    const existingUser = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 400 });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario con el token y la fecha de creación
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        apellidos,
        correo,
        password: hashedPassword,
        verificado: false, // Inicialmente no verificado
        token_verificado: token, // Guardar el token
        fecha_creacion: new Date(), // Guardar la fecha actual
      },
    });

    return NextResponse.json({ message: 'Registro exitoso', usuario: newUser });
  } catch (error) {
    console.error('Error al registrar:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
