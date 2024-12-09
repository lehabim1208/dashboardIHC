import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        correo: true,
      },
    });

    return NextResponse.json({ usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { nombre, correo, password } = await request.json();

    // Validar datos
    if (!nombre || !correo || !password) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        password,
      },
    });

    return NextResponse.json({ message: 'Usuario creado', id: nuevoUsuario.id }, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { nombre, correo, password } = await request.json();

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        correo,
        ...(password && { password }), // Solo actualiza la contraseña si se proporciona
      },
    });

    return NextResponse.json({ message: 'Usuario actualizado', usuario: usuarioActualizado });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.usuario.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}