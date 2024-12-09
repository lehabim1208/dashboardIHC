// app/api/verificar/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { token, correo } = await req.json();

    if (!token || !correo) {
      return NextResponse.json({ error: "Parámetros inválidos o incompletos." }, { status: 400 });
    }

    // Verifica si el correo existe
    const user = await prisma.usuario.findUnique({
      where: { correo: correo },
    });

    if (!user) {
      return NextResponse.json({ error: "No se encontró un usuario con ese correo." }, { status: 404 });
    }

    // Verifica si el token coincide
    if (user.token_verificado !== token) {
      return NextResponse.json({ error: "Token incorrecto o ya utilizado." }, { status: 400 });
    }

    // Verifica si el usuario ya está verificado
    if (user.verificado === true) {
      return NextResponse.json({ message: "El usuario ya está verificado." }, { status: 200 });
    }

    // Actualiza el estado del usuario a verificado
    await prisma.usuario.update({
      where: { correo: user.correo },
      data: {
        verificado: true, // Marca como verificado
        token_verificado: null, // Elimina el token para evitar reutilización
      },
    });

    return NextResponse.json({ message: "Cuenta verificada con éxito." }, { status: 200 });
  } catch (error) {
    console.error("Error verificando datos:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}