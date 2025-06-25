import React, { useEffect, useState } from "react";
import {
  Typography,
  Spinner,
  Input,
  Button,
  Card,
  CardBody,
  Select,
  Option,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { 
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { supabase } from "../../lib/supabase";
import ModalAgregarPropietario from "@/components/ModalAgregarPropietario";
import ModalEditarPropiedad from "@/components/ModalEditarPropiedad";

export function Propiedades() {
  const [loading, setLoading] = useState(true);
  const [propiedades, setPropiedades] = useState([]);
  const [nuevaPropiedad, setNuevaPropiedad] = useState({
    nombre: "",
    direccion: "",
    tipo: "",
    dormitorios: "",
    banos: "",
    superficie: "",
    propietario_id: "",
    valor_arriendo_base: "", // ✅ CAMBIADO de valor_arriendo
    fecha_ingreso: "",
    notas: "",
    // Campos de comisión actualizados
    tiene_comision: false,
    tipo_comision: "",
    valor_comision: "",
  });
  const [listaPropietarios, setListaPropietarios] = useState([]);
  const [mostrarModalPropietario, setMostrarModalPropietario] = useState(false);
  
  // Estado para el Select con renderizado forzado (MANTENER - YA FUNCIONA)
  const [selectedPropietarioId, setSelectedPropietarioId] = useState("");
  const [forceRerender, setForceRerender] = useState(0);

  // NUEVOS ESTADOS PARA EDICIÓN
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

  // NUEVOS ESTADOS PARA VER DETALLES
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
  const [propiedadActiva, setPropiedadActiva] = useState(null);

  // NUEVO ESTADO PARA ORDENAMIENTO
  const [ordenamiento, setOrdenamiento] = useState({
    campo: 'nombre',
    direccion: 'asc'
  });

// Definición de campos por tipo de propiedad
const CAMPOS_POR_TIPO = {
  Departamento: ['dormitorios', 'banos', 'superficie'],
  Casa: ['dormitorios', 'banos', 'superficie'],
  Oficina: ['banos', 'superficie'],
  Local: ['banos', 'superficie'],
  Galpon: ['banos', 'superficie'],
  Estacionamiento: ['superficie'],
  Bodega: ['superficie'],
  Parcela: ['superficie'],
  Lote: ['superficie'],
  Otro: ['superficie']
};

// Helper para verificar si un campo debe mostrarse
const mostrarCampo = (nombreCampo) => {
  const tipoPropiedad = nuevaPropiedad.tipo;
  if (!tipoPropiedad) return false; // Si no hay tipo seleccionado, mostrará solo los campos comunes //
  return CAMPOS_POR_TIPO[tipoPropiedad]?.includes(nombreCampo) || false;
};

useEffect(() => {
  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log("🔍 Usuario actual:", user);
    console.log("🔍 Error de auth:", error);
    
    if (user) {
      console.log("✅ Sí hay usuario autenticado:", user.email);
    } else {
      console.log("❌ NO hay usuario autenticado");
    }
  };
  checkUser();
}, []);

  useEffect(() => {
    fetchPropiedades();
    fetchPropietarios();
  }, []);

  // NUEVO useEffect para ordenamiento
  useEffect(() => {
    if (!loading) {
      fetchPropiedades();
    }
  }, [ordenamiento]);

  useEffect(() => {
    if (selectedPropietarioId !== nuevaPropiedad.propietario_id) {
      setNuevaPropiedad(prev => ({
        ...prev,
        propietario_id: selectedPropietarioId
      }));
    }
  }, [selectedPropietarioId]);

  // FUNCIÓN MODIFICADA para incluir ordenamiento
  const fetchPropiedades = async () => {
    try {
      const { data, error } = await supabase
        .from("propiedades")
        .select("*")
        .order(ordenamiento.campo, { ascending: ordenamiento.direccion === 'asc' });

      if (error) {
        console.error("Error al obtener propiedades:", error.message);
      } else {
        setPropiedades(data);
      }
    } catch (e) {
      console.error("Error inesperado:", e);
    }
    setLoading(false);
  };

  const fetchPropietarios = async () => {
    const { data, error } = await supabase.from("propietarios").select("id, nombre");
    if (error) {
      console.error("Error al obtener propietarios:", error.message);
    } else {
      setListaPropietarios(data);
    }
  };

  // FUNCIÓN CORREGIDA CON CAMPOS DE COMISIÓN ACTUALIZADOS
  const handleAgregarPropiedad = async () => {
    try {
      const {
        nombre,
        direccion,
        tipo,
        dormitorios,
        banos,
        superficie,
        propietario_id,
        valor_arriendo_base, // ✅ CAMBIADO de valor_arriendo
        fecha_ingreso,
        notas,
        // Campos de comisión correctos
        tiene_comision,
        tipo_comision,
        valor_comision,
      } = nuevaPropiedad;

      // Validaciones mejoradas
      if (!nombre?.trim()) {
        alert("El nombre de la propiedad es obligatorio");
        return;
      }
      if (!direccion?.trim()) {
        alert("La dirección es obligatoria");
        return;
      }

      // Preparar datos con los campos correctos de comisión
      const propiedadData = {
        nombre: nombre.trim(),
        direccion: direccion.trim(),
        tipo: tipo || null,
        dormitorios: dormitorios ? parseInt(dormitorios) : null,
        banos: banos ? parseInt(banos) : null,
        superficie: superficie ? parseFloat(superficie) : null,
        propietario_id: propietario_id || null,
        valor_arriendo_base: valor_arriendo_base ? parseInt(valor_arriendo_base) : null, // ✅ CAMBIADO de valor_arriendo
        fecha_ingreso: fecha_ingreso || null,
        notas: notas?.trim() || null,
        // Campos de comisión correctos según tu estructura de Supabase
        tiene_comision: tiene_comision || false,
        tipo_comision: (tiene_comision && tipo_comision) ? tipo_comision : null,
        valor_comision: (tiene_comision && valor_comision) ? parseFloat(valor_comision) : null,
      };

      console.log("Datos a insertar:", propiedadData);

      const { data, error } = await supabase
        .from("propiedades")
        .insert([propiedadData])
        .select();

      if (error) {
        console.error("Error detallado:", error);
        alert(`Error al agregar propiedad: ${error.message}`);
        return;
      }

      console.log("Propiedad insertada:", data);
      alert("Propiedad agregada exitosamente");
      
      // Reset estados (MANTENER - YA FUNCIONA)
      setSelectedPropietarioId("");
      setNuevaPropiedad({
        nombre: "",
        direccion: "",
        tipo: "",
        dormitorios: "",
        banos: "",
        superficie: "",
        propietario_id: "",
        valor_arriendo_base: "", // ✅ CAMBIADO de valor_arriendo
        fecha_ingreso: "",
        notas: "",
        // Campos de comisión
        tiene_comision: false,
        tipo_comision: "",
        valor_comision: "",
      });
      setForceRerender(prev => prev + 1);
      await fetchPropiedades();

    } catch (error) {
      console.error("Error inesperado:", error);
      alert(`Error inesperado: ${error.message}`);
    }
  };

  // Función para manejar la selección con setTimeout (MANTENER - YA FUNCIONA)
  const handlePropietarioChange = (val) => {
    setSelectedPropietarioId(val || "");
    setTimeout(() => {
      setForceRerender(prev => prev + 1);
    }, 10);
  };

  // NUEVA FUNCIÓN para ver detalles
  const verDetalles = (propiedad) => {
    setPropiedadActiva(propiedad);
    setModalDetallesAbierto(true);
  };

  // NUEVA FUNCIÓN para ver en mapa
  const verEnMapa = (direccion) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`,
      "_blank"
    );
  };

  // NUEVAS FUNCIONES PARA MANEJAR ACCIONES
  const handleEditar = (id) => {
    const propiedad = propiedades.find(p => p.id === id);
    setPropiedadSeleccionada(propiedad);
    setMostrarModalEditar(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta propiedad?")) {
      try {
        const { error } = await supabase
          .from("propiedades")
          .delete()
          .eq("id", id);

        if (error) throw error;

        // Actualizar la lista de propiedades
        await fetchPropiedades();
        alert("Propiedad eliminada exitosamente");
      } catch (error) {
        console.error("Error al eliminar:", error.message);
        alert("Error al eliminar la propiedad");
      }
    }
  };

  return (
    <div className="p-6">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Lista de Propiedades
      </Typography>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre o identificador de la Propiedad"
          value={nuevaPropiedad.nombre}
          onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, nombre: e.target.value })}
        />

        <div className="flex gap-2">
          <Input
            label="Dirección"
            value={nuevaPropiedad.direccion}
            onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, direccion: e.target.value })}
            className="flex-1"
          />
          <Button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  nuevaPropiedad.direccion
                )}`,
                "_blank"
              )
            }
            color="blue"
            className="self-start"
          >
            Ver
          </Button>
        </div>

        <Select
            label="Tipo de Propiedad"
            value={nuevaPropiedad.tipo}
            onChange={(val) => {
            // Limpiar campos que no corresponden al nuevo tipo
                const nuevosValores = { ...nuevaPropiedad, tipo: val };
                if (!CAMPOS_POR_TIPO[val]?.includes('dormitorios')) {
                nuevosValores.dormitorios = '';
                }
                if (!CAMPOS_POR_TIPO[val]?.includes('banos')) {
                nuevosValores.banos = '';
                }
                setNuevaPropiedad(nuevosValores);
                }}
            >   
        {/* Opciones del Select */}   
            <Option value="Departamento">Departamento</Option>
            <Option value="Casa">Casa</Option>
            <Option value="Oficina">Oficina</Option>
            <Option value="Local">Local</Option>
            <Option value="Galpon">Galpón</Option>
            <Option value="Estacionamiento">Estacionamiento</Option>
            <Option value="Bodega">Bodega</Option>
            <Option value="Parcela">Parcela</Option>
            <Option value="Lote">Lote</Option>
            <Option value="Otro">Otro</Option>
        </Select>

        {/* PROPIETARIO - MANTENER FUNCIONALIDAD QUE YA FUNCIONA */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Select
              key={`propietario-${forceRerender}`}
              label="Propietario"
              value={selectedPropietarioId}
              onChange={handlePropietarioChange}
            >
              {listaPropietarios.map((propietario) => (
                <Option key={propietario.id} value={propietario.id}>
                  {propietario.nombre}
                </Option>
              ))}
            </Select>
          </div>
            <Button
                onClick={() => setMostrarModalPropietario(true)}
                color="green"
                className="h-[41px] min-w-[70px] rounded-lg text-white text-sm font-bold" // Agregamos min-w-[70px] para asegurar un ancho mínimo
            >
             +
            </Button>
        </div>

        {/* 🔥 AQUÍ ESTÁ EL CAMBIO: Campos condicionales */}
        {mostrarCampo('dormitorios') && (
          <Input
            label="Dormitorios"
            type="number"
            value={nuevaPropiedad.dormitorios}
            onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, dormitorios: e.target.value })}
          />
        )}

        {mostrarCampo('banos') && (
          <Input
            label="Baños"
            type="number"
            value={nuevaPropiedad.banos}
            onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, banos: e.target.value })}
          />
        )}

        <Input
          label="Superficie (m²)"
          type="number"
          value={nuevaPropiedad.superficie}
          onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, superficie: e.target.value })}
        />

        <Input
          label="Valor Arriendo Base" // ✅ CAMBIADO el label
          type="number"
          value={nuevaPropiedad.valor_arriendo_base} // ✅ CAMBIADO de valor_arriendo
          onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, valor_arriendo_base: e.target.value })} // ✅ CAMBIADO
        />

        {/* SECCIÓN DE COMISIÓN ACTUALIZADA */}
        <div className="flex items-center gap-2 p-4 border rounded-lg">
          <input
            type="checkbox"
            id="tiene_comision"
            checked={nuevaPropiedad.tiene_comision}
            onChange={(e) => setNuevaPropiedad({ 
              ...nuevaPropiedad, 
              tiene_comision: e.target.checked,
              // Limpiar los campos si se desmarca
              tipo_comision: e.target.checked ? nuevaPropiedad.tipo_comision : "",
              valor_comision: e.target.checked ? nuevaPropiedad.valor_comision : "",
            })}
            className="w-4 h-4"
          />
          <label htmlFor="tiene_comision" className="text-sm text-gray-700">
            ¿Tiene comisión?
          </label>
        </div>

        {/* Solo mostrar estos campos si tiene_comision es true */}
        {nuevaPropiedad.tiene_comision && (
          <>
            <Select
                label="Tipo de Comisión"
                value={nuevaPropiedad.tipo_comision}
                onChange={(val) => setNuevaPropiedad({ ...nuevaPropiedad, tipo_comision: val })}
            >
                <Option value="% mensual">% mensual</Option>
                <Option value="UF">UF</Option>
                <Option value="USD">USD</Option>
                <Option value="Pago Único">Pago Único</Option>
                <Option value="Otro">Otro</Option>
            </Select>
            
            <Input
              label="Valor Comisión"
              type="number"
              value={nuevaPropiedad.valor_comision}
              onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, valor_comision: e.target.value })}
            />
          </>
        )}

        <Input
          label="Fecha de Ingreso"
          type="date"
          value={nuevaPropiedad.fecha_ingreso}
          onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, fecha_ingreso: e.target.value })}
        />
        <Input
          label="Notas"
          value={nuevaPropiedad.notas}
          onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, notas: e.target.value })}
        />

        <Button onClick={handleAgregarPropiedad} color="blue" className="md:col-span-2">
          Agregar Propiedad
        </Button>
      </div>

      {/* NUEVO: Selector de ordenamiento */}
      <div className="mb-6 flex gap-4 items-center">
        <Typography variant="h6" color="blue-gray">
          Ordenar lista:
        </Typography>
        <div className="w-64">
          <Select
            label="Ordenar por"
            value={`${ordenamiento.campo}-${ordenamiento.direccion}`}
            onChange={(val) => {
              const [campo, direccion] = val.split('-');
              setOrdenamiento({ campo, direccion });
            }}
          >
            <Option value="nombre-asc">Nombre (A-Z)</Option>
            <Option value="nombre-desc">Nombre (Z-A)</Option>
            <Option value="tipo-asc">Tipo (A-Z)</Option>
            <Option value="tipo-desc">Tipo (Z-A)</Option>
            <Option value="valor_arriendo_base-asc">Valor arriendo (Menor a Mayor)</Option>
            <Option value="valor_arriendo_base-desc">Valor arriendo (Mayor a Menor)</Option>
            <Option value="superficie-asc">Superficie (Menor a Mayor)</Option>
            <Option value="superficie-desc">Superficie (Mayor a Menor)</Option>
            <Option value="created_at-desc">Más recientes primero</Option>
            <Option value="created_at-asc">Más antiguos primero</Option>
          </Select>
        </div>
      </div>

      {loading ? (
        <Spinner color="blue" />
      ) : (
        <Card>
          <CardBody>
            {propiedades.length === 0 ? (
              <Typography>No hay propiedades registradas.</Typography>
            ) : (
              <div>
                <Typography className="mb-4">{propiedades.length} propiedad(es) registrada(s).</Typography>
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {["Nombre", "Dirección", "Tipo", "Dormitorios", "Baños", "Valor Arriendo", "Acciones"].map((head) => (
                        <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {propiedades.map((propiedad, index) => {
                      const isLast = index === propiedades.length - 1;
                      const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                      return (
                        <tr key={propiedad.id}>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {propiedad.nombre}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {propiedad.direccion}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {propiedad.tipo}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {propiedad.dormitorios}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {propiedad.banos}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {propiedad.valor_arriendo_base?.toLocaleString('es-CL', { 
                                style: 'currency', 
                                currency: 'CLP' 
                              })}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Menu placement="left-start">
                              <MenuHandler>
                                <IconButton variant="text" color="blue-gray">
                                  <EllipsisVerticalIcon className="h-5 w-5" />
                                </IconButton>
                              </MenuHandler>
                              <MenuList>
                                {/* NUEVO: Botón Ver detalles */}
                                <MenuItem 
                                  onClick={() => verDetalles(propiedad)}
                                  className="flex items-center gap-2"
                                >
                                  <EyeIcon className="h-4 w-4" /> Ver detalles
                                </MenuItem>
                                {/* NUEVO: Botón Ver en mapa */}
                                <MenuItem 
                                  onClick={() => verEnMapa(propiedad.direccion)}
                                  className="flex items-center gap-2"
                                >
                                  <MapPinIcon className="h-4 w-4" /> Ver en mapa
                                </MenuItem>
                                <MenuItem onClick={() => handleEditar(propiedad.id)} className="flex items-center gap-2">
                                  <PencilIcon className="h-4 w-4" /> Editar
                                </MenuItem>
                                <MenuItem onClick={() => handleEliminar(propiedad.id)} className="flex items-center gap-2 text-red-500">
                                  <TrashIcon className="h-4 w-4" /> Eliminar
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* NUEVO: Modal de detalles */}
      <Dialog open={modalDetallesAbierto} handler={() => setModalDetallesAbierto(false)}>
        <DialogHeader>Detalles de la Propiedad</DialogHeader>
        <DialogBody>
          {propiedadActiva && (
            <div className="space-y-2">
              <p><strong>Nombre:</strong> {propiedadActiva.nombre}</p>
              <p><strong>Tipo:</strong> {propiedadActiva.tipo}</p>
              <p><strong>Dirección:</strong> {propiedadActiva.direccion}</p>
              <p><strong>Dormitorios:</strong> {propiedadActiva.dormitorios}</p>
              <p><strong>Baños:</strong> {propiedadActiva.banos}</p>
              <p><strong>Superficie:</strong> {propiedadActiva.superficie} m²</p>
              <p><strong>Valor Arriendo Base:</strong> {propiedadActiva.valor_arriendo_base?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
              {propiedadActiva.tiene_comision && (
                <>
                  <p><strong>Tipo de Comisión:</strong> {propiedadActiva.tipo_comision}</p>
                  <p><strong>Valor Comisión:</strong> {propiedadActiva.valor_comision}</p>
                </>
              )}
              <p><strong>Fecha de Ingreso:</strong> {propiedadActiva.fecha_ingreso}</p>
              <p><strong>Notas:</strong> {propiedadActiva.notas}</p>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setModalDetallesAbierto(false)} color="gray">
            Cerrar
          </Button>
        </DialogFooter>
      </Dialog>

      <ModalAgregarPropietario
        open={mostrarModalPropietario}
        onClose={() => setMostrarModalPropietario(false)}
        onAgregado={() => {
          fetchPropietarios();
        }}
      />

      <ModalEditarPropiedad
        open={mostrarModalEditar}
        onClose={() => {
          setMostrarModalEditar(false);  
          setPropiedadSeleccionada(null);
        }}
        propiedad={propiedadSeleccionada}
        onEdited={fetchPropiedades}
      />
    </div>
  );
}

export default Propiedades;