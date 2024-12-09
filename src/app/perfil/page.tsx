"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { User, ChevronDown, LogOut, Menu, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface UserProfile {
  name: string
  email: string
  bio: string
  avatarUrl: string
}

export default function PerfilPage() {
  const [user, setUser] = useState<UserProfile>({
    name: "Nombre de usuario",
    email: "correo@dominio.com",
    bio: "Descripción sobre de tu personalidad y tu perfil",
    avatarUrl: "/avatars/fotoperfil.jpg"
  })

  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [openCobertura, setOpenCobertura] = useState(false)
  const [openRestricciones, setOpenRestricciones] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const [isValidFile, setIsValidFile] = useState(true)

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
    setMounted(true)
    const savedUser = localStorage.getItem('userProfile')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('userProfile', JSON.stringify(user))
    }
  }, [user, mounted])

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isValidFile) {
      await Swal.fire({
        icon: 'error',
        title: 'Archivo no válido',
        text: 'Por favor, selecciona un archivo de imagen válido antes de guardar.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });

      // Limpiar el input de archivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Limpiar la imagen de vista previa
      setPreviewImage(null);
      // Restablecer la validación
      setIsValidFile(true);
      return;
    }

    const formData = new FormData(event.currentTarget)
    
    let newAvatarUrl = user.avatarUrl

    const file = formData.get('avatar') as File
    if (file && file.size > 0) {
      const imageFormData = new FormData()
      imageFormData.append('file', file)
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData
        })
        if (res.ok) {
          const { fileUrl } = await res.json()
          newAvatarUrl = fileUrl
        } else {
          console.error('Error al subir la imagen:', await res.text())
        }
      } catch (error) {
        console.error('Error al subir la imagen:', error)
      }
    } else {

      newAvatarUrl = user.avatarUrl
    }

    const updatedUser = {
      ...user,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      bio: formData.get('bio') as string,
      avatarUrl: newAvatarUrl,
    }
    setUser(updatedUser)
    setIsEditing(false)
    setPreviewImage(null)
    toast({
      title: "Perfil actualizado",
      description: "Los cambios se han guardado con éxito.",
    })
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setIsValidFile(false)
        Swal.fire({
          icon: 'error',
          title: 'Tipo de archivo no permitido',
          text: 'Solo se aceptan archivos JPG, JPEG y PNG.',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        }).then(() => {
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        });
        return;
      }

      setIsValidFile(true)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Menú lateral para desktop */}
      <aside className="hidden md:block bg-white text-gray-800 w-64 min-h-screen border-r">
        <SidebarContent />
      </aside>

      {/* Contenido principal */}
      <main className="flex-1">
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

        {/* Contenido de la página de perfil */}
        <div className="container mx-auto p-4">
          <Card className="bg-gray-200 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Perfil de Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                {mounted && (
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={`${user.avatarUrl}?${new Date().getTime()}`} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-center max-w-md">{user.bio}</p>
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button className="bg-black text-white">Editar Perfil</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Editar Perfil</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" name="name" defaultValue={user.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={user.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Biografía</Label>
                        <Input id="bio" name="bio" defaultValue={user.bio} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Foto de perfil</Label>
                        <Input 
                          id="avatar" 
                          name="avatar" 
                          type="file" 
                          accept="image/*" 
                          ref={fileInputRef} 
                          className="hidden" 
                          onChange={handleFileChange}
                        />
                        <Button 
                        type="button" 
                        onClick={handleAvatarClick} 
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Subir foto de perfil</span>
                      </Button>
                        {previewImage && (
                          <div className="mt-2">
                            <Image src={previewImage} alt="Preview" width={100} height={100} className="rounded-full" />
                          </div>
                        )}
                      </div>
                      <Button className="bg-black text-white hover:bg-gray-900" type="submit">Guardar Cambios</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Toaster />
    </div>
  )
}