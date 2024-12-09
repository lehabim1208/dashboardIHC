import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token'); // Obtener el token de las cookies
  console.log('Token:', token); // Imprimir el token en la consola

  // Rutas protegidas
  const protectedRoutes = ['/dashboard', '/estadistica', '/crear-reporte', '/crear-reporte-rest', '/perfil'];

  // Verificar si la ruta es protegida y si no hay token
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && !token) {
    console.log('Redirigiendo a /login'); // Imprimir mensaje de redirección
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('Acceso permitido a:', request.nextUrl.pathname); // Imprimir ruta permitida
  return NextResponse.next(); // Permitir el acceso si hay token o la ruta no es protegida
}

// Define las rutas donde se aplicará el middleware
export const config = {
  matcher: ['/dashboard', '/estadistica', '/crear-reporte', '/crear-reporte-rest', '/perfil'],
}; 