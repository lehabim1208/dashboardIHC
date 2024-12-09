import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Importa bcryptjs

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { correo, password } = await request.json();

    // Validar datos
    if (!correo || !password) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Validar el dominio del correo
    if (!correo.endsWith('@estudiantes.uv.mx')) {
      return NextResponse.json({ error: 'El correo debe tener la terminación @estudiantes.uv.mx' }, { status: 400 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { correo },
    });

    // Verificar si el usuario existe
    if (!usuario) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Comparar contraseñas de forma segura
    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    if (!usuario.verificado) { // Esto verifica si verificado es false
      return NextResponse.json({ error: 'Verifique su cuenta a través de su correo institucional' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Inicio de sesión exitoso', usuario });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
