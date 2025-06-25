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
import { propietariosMock } from "./mockData";
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
    telefono: "+56",
    banco: "",
    tipoCuenta: "",
    numeroCuenta: "",
    fechaIngreso: "",
    notas: "",
  });

  const [modalAbierto, setModalAbierto] = useState(false);
  const [propietarioActivo, setPropietarioActivo] = useState(null);

  useEffect(() => {
    setPropietarios(propietariosMock);
    setLoading(false);
  }, []);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customPhoneStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleAgregarPropietario = () => {
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

  const nuevo = {
    id: Date.now(), // ID temporal
    nombre,
    rut_dni,
    correo,
    telefono,
    cuenta_bancaria: {
      banco,
      tipo_cuenta: tipoCuenta,
      numero_cuenta: numeroCuenta,
    },
    fecha_ingreso: fechaIngreso,
    notas,
  };

  setPropietarios((prev) => [...prev, nuevo]);

  setNuevoPropietario({
    nombre: "",
    rut_dni: "",
    correo: "",
    telefono: "+56",
    banco: "",
    tipoCuenta: "",
    numeroCuenta: "",
    fechaIngreso: "",
    notas: "",
  });
};

  const verDetalles = (propietario) => {
    setPropietarioActivo(propietario);
    setModalAbierto(true);
  };

  return (
    <div className="p-6">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Lista de Propietarios
      </Typography>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nombre" value={nuevoPropietario.nombre} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, nombre: e.target.value })} />
        <Input label="RUT o DNI" value={nuevoPropietario.rut_dni} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, rut_dni: e.target.value })} />
        <Input label="Correo" value={nuevoPropietario.correo} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, correo: e.target.value })} />
        <div className="relative w-full min-w-[200px]">
          <PhoneInput
            country={'cl'}
            value={nuevoPropietario.telefono}
            onChange={(phone) => setNuevoPropietario({ ...nuevoPropietario, telefono: phone })}
            containerClass="w-full"
            inputClass="w-full"
          />
          <label className="absolute -top-2 left-2 px-1 text-[11px] text-blue-gray-400 bg-[#f8fafc]">Teléfono</label>
        </div>
        <Select label="Banco" value={nuevoPropietario.banco} onChange={(val) => setNuevoPropietario({ ...nuevoPropietario, banco: val })}>
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
        <Select label="Tipo de Cuenta" value={nuevoPropietario.tipoCuenta} onChange={(val) => setNuevoPropietario({ ...nuevoPropietario, tipoCuenta: val })}>
          <Option value="Cuenta Corriente">Cuenta Corriente</Option>
          <Option value="Cuenta Vista">Cuenta Vista</Option>
          <Option value="Cuenta Ahorro">Cuenta Ahorro</Option>
          <Option value="Cuenta RUT">Cuenta RUT</Option>
          <Option value="Otra">Otra</Option>
        </Select>
        <Input label="Número de Cuenta" value={nuevoPropietario.numeroCuenta} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, numeroCuenta: e.target.value })} />
        <Input type="date" label="Fecha de Ingreso" value={nuevoPropietario.fechaIngreso} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, fechaIngreso: e.target.value })} />
        <Input label="Notas" value={nuevoPropietario.notas} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, notas: e.target.value })} />
        <Button onClick={handleAgregarPropietario} color="blue" className="md:col-span-2">Agregar Propietario</Button>
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
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {["Nombre", "Correo", "Teléfono", "Acciones"].map((head) => (
                        <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">{head}</Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {propietarios.map((prop) => (
                      <tr key={prop.id}>
                        <td className="p-4 border-b border-blue-gray-50">
                          <Typography variant="small" color="blue-gray" className="font-normal">{prop.nombre}</Typography>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <Typography variant="small" color="blue-gray" className="font-normal">{prop.correo}</Typography>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <Typography variant="small" color="blue-gray" className="font-normal">{prop.telefono}</Typography>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <Menu placement="left-start">
                            <MenuHandler>
                              <IconButton variant="text" color="blue-gray">
                                <EllipsisVerticalIcon className="h-5 w-5" />
                              </IconButton>
                            </MenuHandler>
                            <MenuList>
                              <MenuItem onClick={() => verDetalles(prop)} className="flex items-center gap-2">
                                <EyeIcon className="h-4 w-4" /> Ver detalles
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>

          <Dialog open={modalAbierto} handler={() => setModalAbierto(false)}>
  <DialogHeader>Detalles del Propietario</DialogHeader>
  <DialogBody>
    {propietarioActivo ? (
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
    ) : (
      <p>No se ha seleccionado un propietario.</p>
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
    </div>
  );
}

export default Propietarios;