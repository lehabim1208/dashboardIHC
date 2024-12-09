"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { Plus, User, ChevronDown, LogOut, Menu, Edit, Trash2 } from "lucide-react"
import Cookies from 'js-cookie'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
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
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

interface Reporte {
  id: number
  razon: string
  zona: string
  senal: string
  comentarios: string
  estado: string
}

export default function CrearReporte() {
  const [openCobertura, setOpenCobertura] = useState(false)
  const [openRestricciones, setOpenRestricciones] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reportes, setReportes] = useState<Reporte[]>([])
  const [nuevoReporte, setNuevoReporte] = useState<Omit<Reporte, "id" | "estado">>({
    razon: "",
    zona: "",
    senal: "",
    comentarios: "",
  })
  const [isOpen, setIsOpen] = useState(false)
  const [reporteAEliminar, setReporteAEliminar] = useState<number | null>(null)
  const [reporteAEditar, setReporteAEditar] = useState<Reporte | null>(null)
  const { toast } = useToast()
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

  // Cargar reportes desde localStorage al iniciar
  useEffect(() => {
    const reportesCached = localStorage.getItem('reportes')
    if (reportesCached) {
      setReportes(JSON.parse(reportesCached))
    }
  }, [])

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

  const handleCrearReporte = () => {
    if (nuevoReporte.razon && nuevoReporte.zona && nuevoReporte.senal) {
      const nuevoId = reportes.length > 0 ? Math.max(...reportes.map(r => r.id)) + 1 : 1
      const nuevosReportes = [...reportes, { id: nuevoId, ...nuevoReporte, estado: "En espera" }]
      setReportes(nuevosReportes)
      localStorage.setItem('reportes', JSON.stringify(nuevosReportes))
      setNuevoReporte({ razon: "", zona: "", senal: "", comentarios: "" })
      setIsOpen(false)
      toast({
        title: "Reporte creado",
        description: "El reporte se ha creado con éxito.",
      })
    }
  }

  const handleEliminarReporte = () => {
    if (reporteAEliminar) {
      const nuevosReportes = reportes.filter(reporte => reporte.id !== reporteAEliminar)
      setReportes(nuevosReportes)
      localStorage.setItem('reportes', JSON.stringify(nuevosReportes))
      setReporteAEliminar(null)
      toast({
        title: "Reporte eliminado",
        description: "El reporte se ha eliminado con éxito.",
      })
    }
  }

  const handleEditarReporte = () => {
    if (reporteAEditar) {
      const nuevosReportes = reportes.map(reporte =>
        reporte.id === reporteAEditar.id ? reporteAEditar : reporte
      )
      setReportes(nuevosReportes)
      localStorage.setItem('reportes', JSON.stringify(nuevosReportes))
      setReporteAEditar(null)
      toast({
        title: "Reporte editado",
        description: "El reporte se ha editado con éxito.",
      })
    }
  }

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
        <div className="mb-6">
          <h1 className="pl-14 text-2xl font-bold md:pl-0 md:text-3xl mb-4">Mis reportes</h1>
          <h2 className="pl-14 text-lg font-bold md:pl-0 text-gray-500 mb-4">Cobertura</h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Reporte
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Reporte</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="razon" className="text-right">
                    Razón
                  </Label>
                  <Input
                    id="razon"
                    value={nuevoReporte.razon}
                    onChange={(e) => setNuevoReporte({ ...nuevoReporte, razon: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="zona" className="text-right">
                    Zona
                  </Label>
                  <Select
                    onValueChange={(value) => setNuevoReporte({ ...nuevoReporte, zona: value })}
                  >
                    <SelectTrigger className="col-span-3 bg-white">
                      <SelectValue placeholder="Selecciona la zona" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Cafetería">Cafetería</SelectItem>
                      <SelectItem value="Edificio A">Edificio A</SelectItem>
                      <SelectItem value="Edificio B">Edificio B</SelectItem>
                      <SelectItem value="Canchas">Canchas</SelectItem>
                      <SelectItem value="Zona recreativa">Zona recreativa</SelectItem>
                      <SelectItem value="Estacionamiento">Estacionamiento</SelectItem>
                      <SelectItem value="Jardín delantero">Jardín delantero</SelectItem>
                      <SelectItem value="Patio interior">Patio interior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="senal" className="text-right">
                    Señal
                  </Label>
                  <Select
                    onValueChange={(value) => setNuevoReporte({ ...nuevoReporte, senal: value })}
                  >
                    <SelectTrigger className="col-span-3 bg-white">
                      <SelectValue placeholder="Selecciona la señal" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="mala">Mala</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="intermitente">Intermitente</SelectItem>
                      <SelectItem value="nula">Nula</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="comentarios" className="text-right">
                    Comentarios
                  </Label>
                  <textarea
                    id="comentarios"
                    value={nuevoReporte.comentarios}
                    onChange={(e) => setNuevoReporte({ ...nuevoReporte, comentarios: e.target.value })}
                    className="col-span-3"
                    maxLength={1000}
                  />
                </div>
              </div>
              <Button className="bg-black text-white" onClick={handleCrearReporte}>Crear Reporte</Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Contenedor centrado para la tabla */}
        <div className="max-w-4xl mx-auto bg-gray-200 rounded-lg p-4">
          {/* Tabla de reportes */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Razón</TableHead>
                <TableHead>Zona</TableHead>
                <TableHead>Señal</TableHead>
                <TableHead>Comentarios</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportes.map((reporte) => (
                <TableRow key={reporte.id}>
                  <TableCell>{reporte.id}</TableCell>
                  <TableCell>{reporte.razon}</TableCell>
                  <TableCell>{reporte.zona}</TableCell>
                  <TableCell>{reporte.senal}</TableCell>
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

      {/* Modal para editar reporte */}
      <Dialog open={reporteAEditar !== null} onOpenChange={() => setReporteAEditar(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Reporte</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-razon" className="text-right">
                Razón
              </Label>
              <Input
                id="edit-razon"
                value={reporteAEditar?.razon || ""}
                onChange={(e) => setReporteAEditar(reporteAEditar ? {...reporteAEditar, razon: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-zona" className="text-right">
                Zona
              </Label>
              <Select
                onValueChange={(value) => setReporteAEditar(reporteAEditar ? {...reporteAEditar, zona: value} : null)}
                value={reporteAEditar?.zona}
              >
                <SelectTrigger className="col-span-3 bg-white">
                  <SelectValue placeholder="Selecciona la zona" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Cafetería">Cafetería</SelectItem>
                  <SelectItem value="Edificio A">Edificio A</SelectItem>
                  <SelectItem value="Edificio B">Edificio B</SelectItem>
                  <SelectItem value="Canchas">Canchas</SelectItem>
                  <SelectItem value="Zona recreativa">Zona recreativa</SelectItem>
                  <SelectItem value="Estacionamiento">Estacionamiento</SelectItem>
                  <SelectItem value="Jardín delantero">Jardín delantero</SelectItem>
                  <SelectItem value="Patio interior">Patio interior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-senal" className="text-right">
                Señal
              </Label>
              <Select
                onValueChange={(value) => setReporteAEditar(reporteAEditar ? {...reporteAEditar, senal: value} : null)}
                value={reporteAEditar?.senal}
              >
                <SelectTrigger className="col-span-3 bg-white">
                  <SelectValue placeholder="Selecciona la señal" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="mala">Mala</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="intermitente">Intermitente</SelectItem>
                  <SelectItem value="nula">Nula</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-comentarios" className="text-right">
                Comentarios
              </Label>
              <textarea
                id="edit-comentarios"
                value={reporteAEditar?.comentarios || ""}
                onChange={(e) => setReporteAEditar(reporteAEditar ? {...reporteAEditar, comentarios: e.target.value} : null)}
                className="col-span-3"
                maxLength={1000}
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-black text-white w-full" onClick={handleEditarReporte}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}