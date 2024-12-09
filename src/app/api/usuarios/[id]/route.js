import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { nombre, correo, password } = await request.json();

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        correo,
        ...(password && { password }),
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