"use client"

import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { ChevronDown, FileText, Globe, LogOut, Menu, PieChart, Plus, User, Wifi, XCircle } from "lucide-react"
import Cookies from 'js-cookie'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Swal from 'sweetalert2'

export default function Dashboard() {
  const [openCobertura, setOpenCobertura] = useState(false)
  const [openRestricciones, setOpenRestricciones] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()


   const handleLogout = () => {
    Swal.fire({
      title: 'Cerrando sesión',
      html: '<i class="fas fa-spinner fa-spin"></i>',
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 3000,
      didOpen: () => {
        Swal.showLoading()
      }
    }).then(() => {
      Cookies.remove('token');
      router.push('/login')
    })
  }

  const SidebarContent = () => (
    <nav className="p-4">
      <Link href="/dashboard">
      <div className="mb-6 text-xl font-bold">Mi RIUV</div>
      </Link>
      <ul className="space-y-2">
        <li>
          <Button variant="ghost" className="w-full justify-start font-normal">
            <User className="mr-2 h-4 w-4" />
            <Link href="/perfil"
                    className="block py-1 text-sm text-black hover:text-blue-600"
                  >Mi perfil
            </Link>
          </Button>
        </li>
        <li>
          <Collapsible
            open={openCobertura}
            onOpenChange={setOpenCobertura}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between font-normal"
              >
                Cobertura
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openCobertura ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 pt-1">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/crear-reporte"
                    className="block py-1 text-sm text-gray-500 hover:text-blue-600"
                  >
                    Mis reportes
                  </Link>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </li>
        <li>
          <Collapsible
            open={openRestricciones}
            onOpenChange={setOpenRestricciones}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between font-normal"
              >
                Restricciones
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openRestricciones ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 pt-1">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/crear-reporte-rest"
                    className="block py-1 text-sm text-gray-500 hover:text-blue-600"
                  >
                    Mis reportes
                  </Link>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </li>
        <li>
          <Button variant="ghost" className="w-full justify-start font-normal">
            <Link href="/estadistica"
                    className="block py-1 text-sm text-black hover:text-blue-600"
                  >Estadísticas
            </Link>
          </Button>
        </li>
        <li>
        <Button 
          variant="ghost" 
          className="w-full justify-start font-normal text-red-500 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
        </li>
      </ul>
    </nav>
  )

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
      {/* Menú lateral para pantallas medianas y grandes */}
      <aside className="hidden w-64 bg-white shadow-md md:block">
        <SidebarContent />
      </aside>

      {/* Menú lateral para pantallas pequeñas */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Contenido principal */}
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between md:block">
          <h1 className="pl-14 text-2xl font-bold md:pl-0 md:text-3xl">¡Hola de nuevo!</h1>
          <div className="h-12 w-12 md:hidden"></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Crear reporte</CardTitle>
              <CardDescription>Generar un nuevo informe de cobertura</CardDescription>
            </CardHeader>
            <CardContent>
              <Plus className="h-8 w-8 text-blue-500" />
            </CardContent>
            <CardFooter>
              <Link href="/crear-reporte" passHref>
                <Button className="bg-black text-white hover:bg-gray-800">Crear Reporte</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ver Estadísticas</CardTitle>
              <CardDescription>Analizar datos de cobertura y restricciones</CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart className="h-8 w-8 text-green-500" />
            </CardContent>
            <CardFooter>
              <Link href="/estadistica" passHref>
              <Button className="bg-black text-white hover:bg-gray-800">Ver Estadísticas</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mis reportes</CardTitle>
              <CardDescription>Ver y gestionar tus reportes existentes</CardDescription>
            </CardHeader>
            <CardContent>
              <FileText className="h-8 w-8 text-purple-500" />
            </CardContent>
            <CardFooter>
               <Link href="/crear-reporte" passHref>
              <Button className="bg-black text-white hover:bg-gray-800">Ir a mis reportes</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Sección de Anuncios actualizada */}
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Anuncios</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Zonas más reportadas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Wifi className="mr-2 h-4 w-4 text-red-500" />
                    <span>Biblioteca Central</span>
                  </li>
                  <li className="flex items-center">
                    <Wifi className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>Cafetería Principal</span>
                  </li>
                  <li className="flex items-center">
                    <Wifi className="mr-2 h-4 w-4 text-red-500" />
                    <span>Edificio de Ingeniería</span>
                  </li>
                  <li className="flex items-center">
                    <Wifi className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>Área de Deportes</span>
                  </li>
                  <li className="flex items-center">
                    <Wifi className="mr-2 h-4 w-4 text-red-500" />
                    <span>Auditorio Principal</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Páginas más reportadas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                    <span>www.netflix.com</span>
                  </li>
                  <li className="flex items-center">
                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                    <span>www.facebook.com</span>
                  </li>
                  <li className="flex items-center">
                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                    <span>www.instagram.com</span>
                  </li>
                  <li className="flex items-center">
                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                    <span>www.youtube.com</span>
                  </li>
                  <li className="flex items-center">
                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                    <span>www.tiktok.com</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}