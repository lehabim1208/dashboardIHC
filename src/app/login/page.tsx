'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import './loader.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Swal from 'sweetalert2';
import { randomBytes } from 'crypto';
import Cookies from 'js-cookie';

// Cambiar la función para enviar correo
const sendVerificationEmail = async (correo: string, token: string) => {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo, token }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al enviar el correo.');
  }
};


const generateToken = () => {
  return randomBytes(32).toString('hex'); // Genera un token aleatorio de 64 caracteres
};

export default function AuthPage() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Controla si está en modo de inicio de sesión o registro
  const [loading, setLoading] = useState(false); // Agregar estado para el loader
  const [isCheckingToken, setIsCheckingToken] = useState(true); // Estado para verificar el token
  const router = useRouter();

  // Verificar si ya hay un token en las cookies
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      router.push('/dashboard'); // Redirigir al dashboard si hay un token
    } else {
      setIsCheckingToken(false); // Cambiar el estado una vez verificado
    }
  }, [router]);

  if (isCheckingToken) {
    return null; // No mostrar nada mientras se verifica el token
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Activar el loader al enviar el formulario

    // Validar campos requeridos
    if (isLogin) {
      if (!correo.trim() || !password.trim()) {
        setError('Por favor, rellena todos los campos.');
        setLoading(false);
        return;
      }
    } else {
      if (!nombre.trim() || !apellidos.trim() || !correo.trim() || !password.trim() || !repetirPassword.trim()) {
        setError('Por favor, rellena todos los campos.');
        setLoading(false);
        return;
      }

      // Validar que las contraseñas coincidan
      if (password !== repetirPassword) {
        setError('Las contraseñas no coinciden.');
        setLoading(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const token = generateToken(); // Generar el token

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apellidos, correo, password, repetirPassword, token }), // Incluir el token
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || (isLogin ? 'Error al iniciar sesión' : 'Error al registrarse'));
      }

      // Establecer la cookie con el token solo si el inicio de sesión es exitoso
      if (isLogin) {
        Cookies.set('token', token, { expires: 1 }); // La cookie expira en 1 día
      }

      // Enviar el correo de verificación solo si es registro
      if (!isLogin) {
        await sendVerificationEmail(correo, token);
      }

      await Swal.fire({
        icon: 'success',
        title: isLogin ? 'Inicio de sesión correcto' : 'Registro exitoso',
        text: isLogin ? 'Redirigiendo al dashboard...' : 'Por favor, verifica tu correo para activar tu cuenta.',
        timer: isLogin ? 3000 : 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      if (isLogin) {
        router.push('/dashboard');
      } else {
        setIsLogin(true); // Cambiar a modo de inicio de sesión después del registro
        // Limpiar campos de registro
        setNombre('');
        setApellidos('');
        setCorreo('');
        setPassword('');
        setRepetirPassword('');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        setLoading(false);
      } else {
        setError('Error desconocido');
        setLoading(false);
      }
    } finally {
      setLoading(false); // Desactivar el loader al finalizar
    }
  };

  const toggleLoginRegister = () => {
    setIsLogin(!isLogin);
    // Limpiar campos y errores al cambiar de modo
    setNombre('');
    setApellidos('');
    setCorreo('');
    setPassword('');
    setRepetirPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="/uv-logo.png"
              alt="Logo UV"
              width={100}
              height={100}
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input
                    id="apellidos"
                    type="text"
                    placeholder="Tus apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input
                id="correo"
                type="email"
                placeholder="matricula@estudiantes.uv.mx"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="****************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="repetirPassword">Repetir Contraseña</Label>
                <Input
                  id="repetirPassword"
                  type="password"
                  placeholder="****************"
                  value={repetirPassword}
                  onChange={(e) => setRepetirPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-red-600">{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="bg-black text-white hover:bg-gray-900 w-full flex items-center justify-center" disabled={loading}>
              {loading ? (
                <span className="loader"></span> // Loader visual
              ) : (
                isLogin ? 'Iniciar sesión' : 'Registrarse'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm">
              {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
              <Button variant="link" onClick={toggleLoginRegister}>
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
