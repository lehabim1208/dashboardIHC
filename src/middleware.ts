import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token'); // Obtener el token de las cookies

  // Rutas protegidas
  const protectedRoutes = ['/dashboard', '/estadistica', '/crear-reporte', '/crear-reporte-rest', '/perfil'];

  // Verificar si la ruta es protegida y si no hay token
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && !token) {
    // Redirigir a la página de inicio de sesión si no hay token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next(); // Permitir el acceso si hay token o la ruta no es protegida
}

// Define las rutas donde se aplicará el middleware
export const config = {
  matcher: ['/dashboard', '/estadistica', '/crear-reporte', '/crear-reporte-rest', '/perfil'],
};