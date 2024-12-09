import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, message: 'No se proporcionó ningún archivo' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileExtension = file.name.split('.').pop()
    const fileName = `fotoperfil.${fileExtension}`
    const path = join(process.cwd(), 'public/avatars', fileName)
    await writeFile(path, buffer)

    const fileUrl = `/avatars/${fileName}`
    return NextResponse.json({ success: true, fileUrl })
  } catch (error) {
    console.error('Error al subir el archivo:', error)
    return NextResponse.json({ success: false, message: 'Error al subir el archivo' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Solo se permiten solicitudes POST' }, { status: 405 })
}