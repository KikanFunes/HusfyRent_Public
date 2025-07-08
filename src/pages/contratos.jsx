import React, { useState } from "react";
import { Typography, Input, Select, Option, Button } from "@material-tailwind/react";

export function Contratos() {
  const [nuevoContrato, setNuevoContrato] = useState({
    propiedadId: "",
    arrendatarioId: "",
    valorArriendo: "",
    comisión: "",
    iva: 19,
    cargosAdicionales: [],
    descuentos: [],
    glosa: "",
    fechaInicio: "",
    diaCobro: "",
    diaFacturacion: "",
    diaVencimiento: "",
    tipoReajuste: "IPC",
    frecuenciaReajuste: "semestral",
  });

  return (
    <div className="p-6">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Módulo de Contratos
      </Typography>

      {/* DATOS BÁSICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input label="ID de la Propiedad" value={nuevoContrato.propiedadId} onChange={(e) => setNuevoContrato({ ...nuevoContrato, propiedadId: e.target.value })} />
        <Input label="ID del Arrendatario" value={nuevoContrato.arrendatarioId} onChange={(e) => setNuevoContrato({ ...nuevoContrato, arrendatarioId: e.target.value })} />
        <Input label="Valor Arriendo" type="number" value={nuevoContrato.valorArriendo} onChange={(e) => setNuevoContrato({ ...nuevoContrato, valorArriendo: e.target.value })} />
        <Input label="Comisión" type="number" value={nuevoContrato.comisión} onChange={(e) => setNuevoContrato({ ...nuevoContrato, comisión: e.target.value })} />
        <Input label="IVA (%)" type="number" value={nuevoContrato.iva} onChange={(e) => setNuevoContrato({ ...nuevoContrato, iva: e.target.value })} />
      </div>

      {/* CARGOS ADICIONALES */}
      <div className="mb-6">
        <Typography variant="h6" color="blue-gray" className="mb-2">Cargos Adicionales</Typography>
        {nuevoContrato.cargosAdicionales.map((cargo, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              label="Descripción"
              value={cargo.descripcion}
              onChange={(e) => {
                const nuevos = [...nuevoContrato.cargosAdicionales];
                nuevos[index].descripcion = e.target.value;
                setNuevoContrato({ ...nuevoContrato, cargosAdicionales: nuevos });
              }}
            />
            <Input
              label="Monto"
              type="number"
              value={cargo.monto}
              onChange={(e) => {
                const nuevos = [...nuevoContrato.cargosAdicionales];
                nuevos[index].monto = e.target.value;
                setNuevoContrato({ ...nuevoContrato, cargosAdicionales: nuevos });
              }}
            />
          </div>
        ))}
        <Button
          size="sm"
          onClick={() =>
            setNuevoContrato({
              ...nuevoContrato,
              cargosAdicionales: [...nuevoContrato.cargosAdicionales, { descripcion: "", monto: "" }],
            })
          }
        >
          Agregar Cargo
        </Button>
      </div>

      {/* DESCUENTOS */}
      <div className="mb-6">
        <Input
          label="Descuentos (por mes)"
          placeholder="Ej: 15000, 10000"
          value={nuevoContrato.descuentos.join(", ")}
          onChange={(e) =>
            setNuevoContrato({
              ...nuevoContrato,
              descuentos: e.target.value.split(",").map((val) => val.trim()).filter((val) => val !== ""),
            })
          }
        />
      </div>

      {/* REAJUSTE Y GLOSA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Select
          label="Tipo de Reajuste"
          value={nuevoContrato.tipoReajuste}
          onChange={(val) => setNuevoContrato({ ...nuevoContrato, tipoReajuste: val })}
        >
          <Option value="IPC">IPC</Option>
          <Option value="UF">UF</Option>
          <Option value="Dólar">Dólar</Option>
          <Option value="Fijo">Fijo</Option>
        </Select>
        <Select
          label="Frecuencia del Reajuste"
          value={nuevoContrato.frecuenciaReajuste}
          onChange={(val) => setNuevoContrato({ ...nuevoContrato, frecuenciaReajuste: val })}
        >
          <Option value="Mensual">Mensual</Option>
          <Option value="Bimestral">Bimestral</Option>
          <Option value="Trimestral">Trimestral</Option>
          <Option value="Semestral">Semestral</Option>
          <Option value="Anual">Anual</Option>
          <Option value="Fijo">Fijo</Option>
        </Select>
        <Input
          type="text"
          label="Glosa"
          value={nuevoContrato.glosa}
          onChange={(e) => setNuevoContrato({ ...nuevoContrato, glosa: e.target.value })}
        />
      </div>

      {/* FECHAS IMPORTANTES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input type="date" label="Fecha de Inicio" value={nuevoContrato.fechaInicio} onChange={(e) => setNuevoContrato({ ...nuevoContrato, fechaInicio: e.target.value })} />
        <Input type="number" label="Día de Cobro" value={nuevoContrato.diaCobro} onChange={(e) => setNuevoContrato({ ...nuevoContrato, diaCobro: e.target.value })} />
        <Input type="number" label="Día de Facturación" value={nuevoContrato.diaFacturacion} onChange={(e) => setNuevoContrato({ ...nuevoContrato, diaFacturacion: e.target.value })} />
        <Input type="number" label="Día de Vencimiento" value={nuevoContrato.diaVencimiento} onChange={(e) => setNuevoContrato({ ...nuevoContrato, diaVencimiento: e.target.value })} />
      </div>

      {/* BOTÓN GUARDAR */}
      <Button
        onClick={() => console.log("Contrato creado:", nuevoContrato)}
        color="blue"
        className="mt-4"
      >
        Guardar Contrato
      </Button>
    </div>
  );
}

export default Contratos;