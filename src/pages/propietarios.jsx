import React, { useEffect, useState } from "react";
import {
  Typography,
  Spinner,
  Card,
  CardBody,
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import { 
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { supabase } from "../../lib/supabase";
import ModalEditarPropietario from "@/components/ModalEditarPropietario";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const customPhoneStyles = `
  .react-tel-input .form-control {
    width: 100% !important;
    height: 40px !important;
    font-size: 14px !important;
    border: 1px solid #b0bec5 !important;
    border-radius: 7px !important;
    background-color: transparent !important;
    color: #37474f !important;
    font-family: inherit !important;
  }

  .react-tel-input .flag-dropdown {
    background-color: transparent !important;
    border: 1px solid #b0bec5 !important;
    border-right: none !important;
    border-radius: 7px 0 0 7px !important;
  }

  .react-tel-input .selected-flag {
    background-color: transparent !important;
    border-radius: 7px 0 0 7px !important;
  }

  .react-tel-input .country-list {
    border-radius: 7px !important;
    border: 1px solid #b0bec5 !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
    margin-top: 3px !important;
  }

  .react-tel-input .form-control:focus {
    border-color: #2196f3 !important;
    box-shadow: 0 0 0 1px #2196f3 !important;
  }

  .react-tel-input .form-control:focus + .flag-dropdown {
    border-color: #2196f3 !important;
  }
`;

export function Propietarios() {
  const [loading, setLoading] = useState(true);
  const [propietarios, setPropietarios] = useState([]);
  const [nuevoPropietario, setNuevoPropietario] = useState({
  nombre: "",
  rut_dni: "",
  correo: "",
  telefono: "+56", // Inicializar con código de Chile
  banco: "",
  tipoCuenta: "",
  numeroCuenta: "",
  fechaIngreso: "",
  notas: "",
});

  const [modalAbierto, setModalAbierto] = useState(false);
  const [propietarioActivo, setPropietarioActivo] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState(null);

  // Estado para el ordenamiento
  const [ordenamiento, setOrdenamiento] = useState({
    campo: 'nombre',
    direccion: 'asc'
  });

  // Función para obtener propietarios CON ORDENAMIENTO
  const fetchPropietarios = async () => {
    try {
      const { data, error } = await supabase
        .from("propietarios")
        .select("*")
        .order(ordenamiento.campo, { ascending: ordenamiento.direccion === 'asc' });

      if (error) {
        console.error("Error al obtener propietarios:", error.message);
      } else {
        console.log("Propietarios obtenidos:", data);
        setPropietarios(data);
      }
    } catch (e) {
      console.error("Error inesperado al obtener propietarios:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPropietarios();
  }, []);

  // useEffect para actualizar cuando cambie el ordenamiento
  useEffect(() => {
    if (!loading) {
      fetchPropietarios();
    }
  }, [ordenamiento.campo, ordenamiento.direccion]);

  useEffect(() => {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = customPhoneStyles;
  document.head.appendChild(styleSheet);

  return () => {
    document.head.removeChild(styleSheet);
  };
}, []);

  const handleAgregarPropietario = async () => {
    const {
      nombre,
      rut_dni,
      correo,
      telefono,
      banco,
      tipoCuenta,
      numeroCuenta,
      fechaIngreso,
      notas,
    } = nuevoPropietario;

    if (!nombre || !rut_dni) {
      alert("Nombre y RUT/DNI son obligatorios");
      return;
    }

    const cuenta_bancaria = {
      banco,
      tipo_cuenta: tipoCuenta,
      numero_cuenta: numeroCuenta,
    };

    const { error } = await supabase.from("propietarios").insert([
      {
        nombre,
        rut_dni,
        correo,
        telefono,
        cuenta_bancaria,
        fecha_ingreso: fechaIngreso,
        notas,
      },
    ]);

    if (error) {
      alert("Error al agregar propietario");
      console.error(error);
    } else {
      // Actualizado para incluir el código de país por defecto
      setNuevoPropietario({
        nombre: "",
        rut_dni: "",
        correo: "",
        telefono: "+56", // Reset con código de Chile
        banco: "",
        tipoCuenta: "",
        numeroCuenta: "",
        fechaIngreso: "",
        notas: "",
      });

      await fetchPropietarios();
    }
  };

  const verDetalles = (propietario) => {
    setPropietarioActivo(propietario);
    setModalAbierto(true);
  };

  const handleEditar = (propietario) => {
    setPropietarioSeleccionado(propietario);
    setMostrarModalEditar(true);
  };

  const handleEliminar = async (id) => {
  if (window.confirm("¿Estás seguro de que deseas eliminar este propietario?")) {
    try {
      // Primero verificamos que el propietario existe
      const { data: existingData } = await supabase
        .from("propietarios")
        .select()
        .eq("id", id)
        .single();

      if (!existingData) {
        alert("No se encontró el propietario");
        return;
      }

      // Realizamos la eliminación
      const { error } = await supabase
        .from("propietarios")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Actualizamos el estado local inmediatamente
      setPropietarios(prevPropietarios => 
        prevPropietarios.filter(prop => prop.id !== id)
      ); // ✅ CAMBIO 1: Usar función callback
      
      // ❌ CAMBIO 2: ELIMINAR esta línea
      // await fetchPropietarios();
      
      alert("Propietario eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar:", error.message);
      alert("Error al eliminar el propietario");
    }
  }
};

  return (
    <div className="p-6">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Lista de Propietarios
      </Typography>

      {/* Formulario para agregar propietario */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Nombre" 
          value={nuevoPropietario.nombre} 
          onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, nombre: e.target.value })} 
        />
        <Input 
          label="RUT o DNI" 
          value={nuevoPropietario.rut_dni} 
          onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, rut_dni: e.target.value })} 
        />
        <Input 
          label="Correo" 
          value={nuevoPropietario.correo} 
          onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, correo: e.target.value })} 
        />
        {/* Reemplazar el Input de teléfono existente por: */}
        <div className="relative w-full min-w-[200px]">
          <PhoneInput
            country={'cl'}
            value={nuevoPropietario.telefono}
            onChange={(phone) => setNuevoPropietario({ ...nuevoPropietario, telefono: phone })}
            containerClass="w-full"
            inputClass="w-full"
            enableSearch={true}
            searchPlaceholder="Buscar país..."
            searchNotFound="País no encontrado"
            preferredCountries={['cl', 'ar', 'pe', 'bo', 'ec', 'co', 've', 'py', 'uy', 'br']}
          />
            <label className="absolute -top-2 left-2 px-1 text-[11px] text-blue-gray-400 bg-[#f8fafc]">
            Teléfono
            </label>
        </div>
        <div>
          <Select
            label="Banco"
            value={nuevoPropietario.banco}
            onChange={(val) =>
              setNuevoPropietario({ ...nuevoPropietario, banco: val })
            }
          >
            <Option value="Banco de Chile">Banco de Chile</Option>
            <Option value="Banco BCI">Banco BCI</Option>
            <Option value="Banco Estado">Banco Estado</Option>
            <Option value="Banco Santander">Banco Santander</Option>
            <Option value="Banco Itaú">Banco Itaú</Option>
            <Option value="Banco Falabella">Banco Falabella</Option>
            <Option value="Scotiabank">Scotiabank</Option>
            <Option value="Banco Bice">Banco Bice</Option>
            <Option value="Banco Internacional">Banco Internacional</Option>
            <Option value="Banco Consorcio">Banco Consorcio</Option>
            <Option value="Banco Ripley">Banco Ripley</Option>
            <Option value="HSBC">HSBC</Option>
            <Option value="Tenpo">Tenpo</Option>
            <Option value="Mercado Pago">Mercado Pago</Option>
            <Option value="Tapp Caja Los Andes">Tapp Caja Los Andes</Option>
            <Option value="Otro">Otro</Option>
          </Select>
        </div>
        <div>
          <Select
            label="Tipo de Cuenta"
            value={nuevoPropietario.tipoCuenta}
            onChange={(val) =>
              setNuevoPropietario({ ...nuevoPropietario, tipoCuenta: val })
            }
          >
            <Option value="Cuenta Corriente">Cuenta Corriente</Option>
            <Option value="Cuenta Vista">Cuenta Vista</Option>
            <Option value="Cuenta Ahorro">Cuenta Ahorro</Option>
            <Option value="Cuenta RUT">Cuenta RUT</Option>
            <Option value="Otra">Otra</Option>
          </Select>
        </div>
        <Input 
          label="Número de Cuenta" 
          value={nuevoPropietario.numeroCuenta} 
          onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, numeroCuenta: e.target.value })} 
        />
        <Input 
          type="date" 
          label="Fecha de Ingreso" 
          value={nuevoPropietario.fechaIngreso} 
          onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, fechaIngreso: e.target.value })} 
        />
        <Input 
          label="Notas" 
          value={nuevoPropietario.notas} 
          onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, notas: e.target.value })} 
        />
        <Button 
          onClick={handleAgregarPropietario} 
          color="blue" 
          className="md:col-span-2"
        >
          Agregar Propietario
        </Button>
      </div>

      {/* SELECTOR DE ORDENAMIENTO - NUEVA POSICIÓN */}
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
            <Option value="correo-asc">Correo (A-Z)</Option>
            <Option value="correo-desc">Correo (Z-A)</Option>
            <Option value="telefono-asc">Teléfono (Ascendente)</Option>
            <Option value="telefono-desc">Teléfono (Descendente)</Option>
            <Option value="created_at-desc">Más recientes primero</Option>
            <Option value="created_at-asc">Más antiguos primero</Option>
            <Option value="id-asc">Orden original</Option>
          </Select>
        </div>
      </div>

      {loading ? (
        <Spinner color="blue" />
      ) : (
        <>
          <Card>
            <CardBody>
              {propietarios.length === 0 ? (
                <Typography>No hay propietarios registrados.</Typography>
              ) : (
                <div>
                  <Typography className="mb-4">{propietarios.length} propietario(s) registrado(s).</Typography>
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        {["Nombre", "Correo", "Teléfono", "Acciones"].map((head) => (
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
                      {propietarios.map((prop, index) => {
                        const isLast = index === propietarios.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                        return (
                          <tr key={prop.id}>
                            <td className={classes}>
                              <Typography variant="small" color="blue-gray" className="font-normal">
                                {prop.nombre}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography variant="small" color="blue-gray" className="font-normal">
                                {prop.correo}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography variant="small" color="blue-gray" className="font-normal">
                                {prop.telefono}
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
                                  <MenuItem 
                                    onClick={() => verDetalles(prop)} 
                                    className="flex items-center gap-2"
                                  >
                                    <EyeIcon className="h-4 w-4" /> Ver detalles
                                  </MenuItem>
                                  <MenuItem 
                                    onClick={() => handleEditar(prop)} 
                                    className="flex items-center gap-2"
                                  >
                                    <PencilIcon className="h-4 w-4" /> Editar
                                  </MenuItem>
                                  <MenuItem 
                                    onClick={() => handleEliminar(prop.id)} 
                                    className="flex items-center gap-2 text-red-500"
                                  >
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

          <Dialog open={modalAbierto} handler={() => setModalAbierto(false)}>
            <DialogHeader>Detalles del Propietario</DialogHeader>
            <DialogBody>
              {propietarioActivo && (
                <div className="space-y-2">
                  <p><strong>Nombre:</strong> {propietarioActivo.nombre}</p>
                  <p><strong>RUT / DNI:</strong> {propietarioActivo.rut_dni}</p>
                  <p><strong>Correo:</strong> {propietarioActivo.correo}</p>
                  <p><strong>Teléfono:</strong> {propietarioActivo.telefono}</p>
                  <p><strong>Banco:</strong> {propietarioActivo.cuenta_bancaria?.banco}</p>
                  <p><strong>Tipo de Cuenta:</strong> {propietarioActivo.cuenta_bancaria?.tipo_cuenta}</p>
                  <p><strong>Número de Cuenta:</strong> {propietarioActivo.cuenta_bancaria?.numero_cuenta}</p>
                  <p><strong>Fecha de Ingreso:</strong> {propietarioActivo.fecha_ingreso}</p>
                  <p><strong>Notas:</strong> {propietarioActivo.notas}</p>
                </div>
              )}
            </DialogBody>
            <DialogFooter>
              <Button variant="text" onClick={() => setModalAbierto(false)} color="gray">
                Cerrar
              </Button>
            </DialogFooter>
          </Dialog>
        </>
      )}

      {mostrarModalEditar && propietarioSeleccionado && (
        <ModalEditarPropietario
          open={mostrarModalEditar}
          propietario={propietarioSeleccionado}
          onClose={() => {
            setMostrarModalEditar(false);
            setPropietarioSeleccionado(null);
          }}
          onGuardar={async (datosActualizados) => {
            console.log("=== INICIO PROCESO DE ACTUALIZACIÓN ===");
            console.log("🆔 ID recibido:", datosActualizados.id);
            console.log("🔍 Tipo del ID:", typeof datosActualizados.id);
            console.log("📋 Datos completos:", datosActualizados);

            try {
              // PASO 1: Verificar que el registro existe
              console.log("🔍 PASO 1: Verificando existencia del registro...");
              const { data: registroExistente, error: errorBusqueda } = await supabase
                .from("propietarios")
                .select("*")
                .eq("id", datosActualizados.id);

              console.log("📊 Resultado de búsqueda:", registroExistente);
              console.log("❌ Error de búsqueda:", errorBusqueda);

              if (errorBusqueda) {
                console.error("Error al buscar el registro:", errorBusqueda);
                return false;
              }

              if (!registroExistente || registroExistente.length === 0) {
                console.error("❌ El registro no existe");
                alert("Error: El propietario no existe en la base de datos");
                return false;
              }

              console.log("✅ Registro encontrado:", registroExistente[0]);

              // PASO 2: Preparar datos para actualización
              const cuenta_bancaria = {
                banco: datosActualizados.banco || null,
                tipo_cuenta: datosActualizados.tipoCuenta || null,
                numero_cuenta: datosActualizados.numeroCuenta || null
              };

              const actualizacion = {
                nombre: datosActualizados.nombre,
                rut_dni: datosActualizados.rut_dni || null,
                correo: datosActualizados.correo || null,
                telefono: datosActualizados.telefono || null,
                cuenta_bancaria,
                fecha_ingreso: datosActualizados.fechaIngreso || null,
                notas: datosActualizados.notas || null
              };

              console.log("📦 PASO 2: Objeto de actualización:", actualizacion);

              // PASO 3: Ejecutar actualización SIN .select() y SIN .single()
              console.log("🔄 PASO 3: Ejecutando actualización...");
              const { data, error, status, statusText } = await supabase
                .from("propietarios")
                .update(actualizacion)
                .eq("id", datosActualizados.id);

              console.log("📊 Resultado de actualización:");
              console.log("- Data:", data);
              console.log("- Error:", error);
              console.log("- Status:", status);
              console.log("- StatusText:", statusText);

              if (error) {
                console.error("❌ Error al actualizar:", error);
                return false;
              }

              // PASO 4: Verificar que se actualizó
              console.log("🔍 PASO 4: Verificando actualización...");
              const { data: registroActualizado, error: errorVerificacion } = await supabase
                .from("propietarios")
                .select("*")
                .eq("id", datosActualizados.id)
                .single();

              console.log("📊 Registro después de actualización:", registroActualizado);
              console.log("❌ Error de verificación:", errorVerificacion);

              if (errorVerificacion) {
                console.error("Error al verificar actualización:", errorVerificacion);
                // Pero continuamos porque el UPDATE pudo haber funcionado
              }

              // PASO 5: Refrescar tabla y cerrar modal
              console.log("🔄 PASO 5: Refrescando datos...");
              await fetchPropietarios();
              
              console.log("✅ Proceso completado exitosamente");
              return true;

            } catch (error) {
              console.error("💥 Error general en el proceso:", error);
              return false;
            }
          }}
        />
      )}
    </div>
  );
}

export default Propietarios;