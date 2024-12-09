'use client'

import { useState, useEffect, useMemo } from 'react'
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { Button } from "@mui/material"
import Swal from 'sweetalert2'

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  password: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('/api/usuarios')
      const data = await response.json()
      console.log('Datos recibidos de la API:', data)
      
      let usuariosData = []
      if (Array.isArray(data)) {
        usuariosData = data
      } else if (data.usuarios && Array.isArray(data.usuarios)) {
        usuariosData = data.usuarios
      } else if (typeof data === 'object') {
        usuariosData = Object.values(data)
      }

      if (usuariosData.length > 0) {
        setUsuarios(usuariosData)
        setError(null)
      } else {
        console.error('No se encontraron usuarios en los datos:', data)
        setError('No se encontraron usuarios')
        setUsuarios([])
      }
    } catch (err) {
      console.error('Error al obtener usuarios:', err)
      setError('Error al cargar los usuarios')
      setUsuarios([])
    }
  }

  const crearUsuario = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Crear Nuevo Usuario',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Correo">' +
        '<input id="swal-input3" class="swal2-input" type="password" placeholder="Contraseña">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById('swal-input1') as HTMLInputElement).value,
          (document.getElementById('swal-input2') as HTMLInputElement).value,
          (document.getElementById('swal-input3') as HTMLInputElement).value
        ]
      }
    })

    if (formValues) {
      const [nombre, correo, password] = formValues
      if (!nombre || !correo || !password) {
        Swal.fire('Error', 'Todos los campos son requeridos', 'error')
        return
      }

      try {
        const response = await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, correo, password })
        })

        if (response.ok) {
          const data = await response.json()
          Swal.fire('¡Creado!', data.message, 'success')
          fetchUsuarios()
        } else {
          const errorData = await response.json()
          Swal.fire('Error', errorData.error || 'No se pudo crear el usuario', 'error')
        }
      } catch (error) {
        console.error('Error al crear usuario:', error)
        Swal.fire('Error', 'Ocurrió un error al crear el usuario', 'error')
      }
    }
  }

  const editarUsuario = async (usuario: Usuario) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Usuario',
      html:
        `<input id="swal-input1" class="swal2-input" value="${usuario.nombre}" placeholder="Nombre">` +
        `<input id="swal-input2" class="swal2-input" value="${usuario.correo}" placeholder="Correo">` +
        `<input id="swal-input3" class="swal2-input" type="password" placeholder="Nueva contraseña (dejar en blanco para no cambiar)">`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById('swal-input1') as HTMLInputElement).value,
          (document.getElementById('swal-input2') as HTMLInputElement).value,
          (document.getElementById('swal-input3') as HTMLInputElement).value
        ]
      }
    })

    if (formValues) {
      const [nombre, correo, password] = formValues
      const updateData: Partial<Usuario> = { nombre, correo }
      if (password) {
        updateData.password = password
      }
      try {
        console.log('Enviando solicitud de actualización:', updateData);
        const response = await fetch(`/api/usuarios/${usuario.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        })
        console.log('Respuesta recibida:', response);
        if (response.ok) {
          const data = await response.json()
          console.log('Datos de respuesta:', data);
          Swal.fire('¡Actualizado!', data.message, 'success')
          fetchUsuarios()
        } else {
          const errorData = await response.json()
          console.error('Error en la respuesta:', errorData);
          Swal.fire('Error', errorData.error || 'No se pudo actualizar el usuario', 'error')
        }
      } catch (error) {
        console.error('Error al actualizar usuario:', error)
        Swal.fire('Error', 'Ocurrió un error al actualizar el usuario', 'error')
      }
    }
  }

  const eliminarUsuario = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        console.log('Enviando solicitud de eliminación para el ID:', id);
        const response = await fetch(`/api/usuarios/${id}`, {
          method: 'DELETE'
        })
        console.log('Respuesta recibida:', response);
        if (response.ok) {
          const data = await response.json()
          console.log('Datos de respuesta:', data);
          Swal.fire('¡Eliminado!', data.message, 'success')
          fetchUsuarios()
        } else {
          const errorData = await response.json()
          console.error('Error en la respuesta:', errorData);
          Swal.fire('Error', errorData.error || 'No se pudo eliminar el usuario', 'error')
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error)
        Swal.fire('Error', 'Ocurrió un error al eliminar el usuario', 'error')
      }
    }
  }

  const columns = useMemo<MRT_ColumnDef<Usuario>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'nombre',
        header: 'Nombre',
      },
      {
        accessorKey: 'correo',
        header: 'Correo',
      },
      {
        accessorKey: 'password',
        header: 'Contraseña',
        Cell: () => '••••••••',
      },
    ],
    []
  )

  return (
    <div className="container mx-auto py-10">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="mb-4">
        <Button variant="contained" color="primary" onClick={crearUsuario}>
          Crear Nuevo Usuario
        </Button>
      </div>

      <MaterialReactTable
        columns={columns}
        data={usuarios}
        enableColumnActions={false}
        enableColumnFilters={false}
        enablePagination={true}
        enableSorting={true}
        enableBottomToolbar={true}
        enableTopToolbar={true}
        muiTableBodyRowProps={{ hover: true }}
        renderRowActions={({ row }) => (
          <div className="flex space-x-2">
            <Button 
              onClick={() => editarUsuario(row.original)}
              variant="outlined"
              size="small"
            >
              Editar
            </Button>
            <Button 
              onClick={() => eliminarUsuario(row.original.id)}
              variant="outlined"
              color="error"
              size="small"
            >
              Eliminar
            </Button>
          </div>
        )}
      />
    </div>
  )
}
