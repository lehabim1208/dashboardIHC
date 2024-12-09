"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { User, ChevronDown, LogOut, Menu, WifiIcon, ShieldAlertIcon } from "lucide-react"
import { Bar } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function EstadisticaPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [openCobertura, setOpenCobertura] = useState(false)
  const [openRestricciones, setOpenRestricciones] = useState(false)
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

  // Datos para las gráficas
  const coberturaData = {
    labels: ['Zona A', 'Zona B', 'Zona C', 'Zona D', 'Zona E'],
    datasets: [
      {
        label: 'Reportes de cobertura WiFi',
        data: [80, 65, 90, 55, 70],
        backgroundColor: 'rgba(75, 192, 192, 0.5)', // Verde azulado
      },
    ],
  }

  const restriccionesData = {
    labels: ['Facebook', 'YouTube', 'Twitter', 'Instagram', 'TikTok'],
    datasets: [
      {
        label: 'Reportes de restricciones',
        data: [45, 75, 30, 60, 50],
        backgroundColor: 'rgba(34, 197, 94, 0.5)', // Verde
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Estadísticas',
      },
    },
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menú lateral para desktop */}
      <aside className="hidden md:block bg-white text-gray-800 w-64 min-h-screen border-r">
        <SidebarContent />
      </aside>

      {/* Contenido principal */}
      <main className="flex-1">
        {/* Header con botón de menú para móviles */}
        <header className="bg-white p-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold">Estadísticas</h1>
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        {/* Contenido de la página de estadísticas */}
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Estadísticas</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Estadísticas de cobertura WiFi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <WifiIcon className="mr-2" />
                  Zonas con más reportes de cobertura WiFi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Bar options={options} data={coberturaData} />
              </CardContent>
            </Card>

            {/* Estadísticas de restricciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldAlertIcon className="mr-2" />
                  Reportes de páginas con restricciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Bar options={options} data={restriccionesData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}