"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { Plus, Edit, Trash2, User, ChevronDown, LogOut, Menu } from "lucide-react"
import Cookies from 'js-cookie'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

interface Reporte {
  id: number
  paginaRestringida: string
  codigoMostrado: string
  comentarios: string
  estado: string
}

export default function CrearReporteRest() {
  const [reportes, setReportes] = useState<Reporte[]>([])
  const [nuevoReporte, setNuevoReporte] = useState<Omit<Reporte, "id" | "estado">>({
    paginaRestringida: "",
    codigoMostrado: "",
    comentarios: "",
  })
  const [isOpen, setIsOpen] = useState(false)
  const [reporteAEditar, setReporteAEditar] = useState<Reporte | null>(null)
  const [reporteAEliminar, setReporteAEliminar] = useState<number | null>(null)
  const { toast } = useToast()
  const [openCobertura, setOpenCobertura] = useState(false)
  const [openRestricciones, setOpenRestricciones] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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

  useEffect(() => {
    const reportesCached = localStorage.getItem('reportes-rest')
    if (reportesCached) {
      setReportes(JSON.parse(reportesCached))
    }
  }, [])

  const handleCrearReporte = () => {
    if (nuevoReporte.paginaRestringida) {
      const nuevoId = reportes.length > 0 ? Math.max(...reportes.map(r => r.id)) + 1 : 1
      const nuevosReportes = [...reportes, { id: nuevoId, ...nuevoReporte, estado: "En espera" }]
      setReportes(nuevosReportes)
      localStorage.setItem('reportes-rest', JSON.stringify(nuevosReportes))
      setNuevoReporte({ paginaRestringida: "", codigoMostrado: "", comentarios: "" })
      setIsOpen(false)
      toast({
        title: "Reporte creado",
        description: "El reporte se ha creado con éxito.",
      })
    }
  }

  const handleEditarReporte = () => {
    if (reporteAEditar) {
      const nuevosReportes = reportes.map(reporte =>
        reporte.id === reporteAEditar.id ? reporteAEditar : reporte
      )
      setReportes(nuevosReportes)
      localStorage.setItem('reportes-rest', JSON.stringify(nuevosReportes))
      setReporteAEditar(null)
      toast({
        title: "Reporte editado",
        description: "El reporte se ha editado con éxito.",
      })
    }
  }

  const handleEliminarReporte = () => {
    if (reporteAEliminar !== null) {
      const nuevosReportes = reportes.filter(reporte => reporte.id !== reporteAEliminar)
      setReportes(nuevosReportes)
      localStorage.setItem('reportes-rest', JSON.stringify(nuevosReportes))
      setReporteAEliminar(null)
      toast({
        title: "Reporte eliminado",
        description: "El reporte se ha eliminado con éxito.",
      })
    }
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
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Header con botón de menú para móviles */}
      <header className="bg-white p-4 flex justify-between items-center md:hidden">
        <h1 className="text-xl font-bold">Mi RIUV</h1>
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

      <div className="flex flex-1 md:flex-row">
        {/* Menú lateral para desktop */}
        <aside className="hidden md:block bg-white text-gray-800 w-64 min-h-screen border-r">
          <SidebarContent />
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold md:text-3xl mb-2">Mis reportes</h1>
            <h2 className="pl-14 text-lg font-bold md:pl-0 text-gray-500 mb-4">Páginas restringidas</h2>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Reporte
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Reporte Restringido</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="paginaRestringida" className="text-right">
                      Página restringida
                    </Label>
                    <Input
                      id="paginaRestringida"
                      value={nuevoReporte.paginaRestringida}
                      onChange={(e) => setNuevoReporte({ ...nuevoReporte, paginaRestringida: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="codigoMostrado" className="text-right">
                      Código mostrado
                    </Label>
                    <Input
                      id="codigoMostrado"
                      value={nuevoReporte.codigoMostrado}
                      onChange={(e) => setNuevoReporte({ ...nuevoReporte, codigoMostrado: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="comentarios" className="text-right">
                      Comentarios
                    </Label>
                    <Textarea
                      id="comentarios"
                      value={nuevoReporte.comentarios}
                      onChange={(e) => setNuevoReporte({ ...nuevoReporte, comentarios: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button className="bg-black text-white" onClick={handleCrearReporte}>Crear Reporte</Button>
              </DialogContent>
            </Dialog>
          </div>

          {/* Contenedor centrado para la tabla */}
          <div className="max-w-4xl mx-auto bg-gray-200 rounded-lg p-4 shadow">
            {/* Tabla de reportes */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Página restringida</TableHead>
                  <TableHead>Código mostrado</TableHead>
                  <TableHead>Comentarios</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportes.map((reporte) => (
                  <TableRow key={reporte.id}>
                    <TableCell>{reporte.id}</TableCell>
                    <TableCell>{reporte.paginaRestringida}</TableCell>
                    <TableCell>{reporte.codigoMostrado}</TableCell>
                    <TableCell>{reporte.comentarios}</TableCell>
                    <TableCell className="text-gray-500">{reporte.estado}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => setReporteAEditar(reporte)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setReporteAEliminar(reporte.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {/* Modal para editar reporte */}
      <Dialog open={reporteAEditar !== null} onOpenChange={() => setReporteAEditar(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Reporte Restringido</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-paginaRestringida" className="text-right">
                Página restringida
              </Label>
              <Input
                id="edit-paginaRestringida"
                value={reporteAEditar?.paginaRestringida || ""}
                onChange={(e) => setReporteAEditar(reporteAEditar ? {...reporteAEditar, paginaRestringida: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-codigoMostrado" className="text-right">
                Código mostrado
              </Label>
              <Input
                id="edit-codigoMostrado"
                value={reporteAEditar?.codigoMostrado || ""}
                onChange={(e) => setReporteAEditar(reporteAEditar ? {...reporteAEditar, codigoMostrado: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-comentarios" className="text-right">
                Comentarios
              </Label>
              <Textarea
                id="edit-comentarios"
                value={reporteAEditar?.comentarios || ""}
                onChange={(e) => setReporteAEditar(reporteAEditar ? {...reporteAEditar, comentarios: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
          </div>
          <Button className="bg-black text-white" onClick={handleEditarReporte}>Guardar Cambios</Button>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={reporteAEliminar !== null} onOpenChange={() => setReporteAEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar este reporte?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-200 text-gray-800">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 text-white" onClick={handleEliminarReporte}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}