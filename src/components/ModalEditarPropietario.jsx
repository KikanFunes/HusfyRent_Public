import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { supabase } from "../lib/supabase";

const ModalEditarPropietario = ({ open, onClose, propietario, onGuardar }) => {
  const [datos, setDatos] = useState({
    id: "",
    nombre: "",
    rut_dni: "",
    correo: "",
    telefono: "",
    banco: "",
    tipoCuenta: "",
    numeroCuenta: "",
    fechaIngreso: "",
    notas: "",
  });

  useEffect(() => {
    if (propietario) {
      console.log("🔍 Propietario recibido en modal:", propietario);
      setDatos({
        id: propietario.id,
        nombre: propietario.nombre || "",
        rut_dni: propietario.rut_dni || "",
        correo: propietario.correo || "",
        telefono: propietario.telefono || "",
        banco: propietario.cuenta_bancaria?.banco || "",
        tipoCuenta: propietario.cuenta_bancaria?.tipo_cuenta || "",
        numeroCuenta: propietario.cuenta_bancaria?.numero_cuenta || "",
        fechaIngreso: propietario.fecha_ingreso?.split("T")[0] || "",
        notas: propietario.notas || "",
      });
    }
  }, [propietario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prevDatos) => ({
      ...prevDatos,
      [name]: value,
    }));
  };

  const handleGuardar = async () => {
    if (!datos.nombre?.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    if (!datos.id) {
      console.error("❌ No hay ID del propietario");
      alert("Error: No se puede identificar el propietario");
      return;
    }

    console.log("📤 Datos que se enviarán:", datos);

    if (onGuardar) {
      const exito = await onGuardar(datos);
      if (exito) {
        onClose();
      }
    }
  };

  return (
    <Dialog 
        open={open} 
        handler={onClose}
        dismiss={{ enabled: true }}
        animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
        }}
    >
      <DialogHeader>Editar Propietario</DialogHeader>
      <DialogBody className="grid gap-4">
        <Input label="Nombre" name="nombre" value={datos.nombre} onChange={handleChange} />
        <Input label="RUT/DNI" name="rut_dni" value={datos.rut_dni} onChange={handleChange} />
        <Input label="Correo" name="correo" value={datos.correo} onChange={handleChange} />
        <Input label="Teléfono" name="telefono" value={datos.telefono} onChange={handleChange} />

        <Select
          label="Banco"
          value={datos.banco}
          onChange={(val) => setDatos({ ...datos, banco: val })}
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

        <Select
          label="Tipo de Cuenta"
          value={datos.tipoCuenta}
          onChange={(val) => setDatos({ ...datos, tipoCuenta: val })}
        >
          <Option value="Cuenta Corriente">Cuenta Corriente</Option>
          <Option value="Cuenta Vista">Cuenta Vista</Option>
          <Option value="Cuenta Ahorro">Cuenta Ahorro</Option>
          <Option value="Cuenta RUT">Cuenta RUT</Option>
          <Option value="Otra">Otra</Option>
        </Select>

        <Input label="Número de Cuenta" name="numeroCuenta" value={datos.numeroCuenta} onChange={handleChange} />
        <Input label="Fecha de Ingreso" type="date" name="fechaIngreso" value={datos.fechaIngreso} onChange={handleChange} />
        <Input label="Notas" name="notas" value={datos.notas} onChange={handleChange} />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose}>Cancelar</Button>
        <Button color="blue" onClick={handleGuardar}>Guardar Cambios</Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ModalEditarPropietario;