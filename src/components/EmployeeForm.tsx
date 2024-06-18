// EmployeeForm.tsx
import React, { useState } from 'react';
import './EmployeeForm.css';

interface EmployeeFormProps {
  areas: string[];
  agregarEmpleado: (nuevoEmpleado: { area: string; nombre: string; horas: number }) => void;
  mostrarMensaje: (mensaje: string) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ areas, agregarEmpleado, mostrarMensaje }) => {
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ area: '', nombre: '', horas: NaN });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const horas = parseFloat(nuevoEmpleado.horas.toString());
    if (!nuevoEmpleado.area || !nuevoEmpleado.nombre.trim() || isNaN(horas) || horas < 0) {
      mostrarMensaje("Por favor, complete todos los campos correctamente.");
      return;
    }
    agregarEmpleado(nuevoEmpleado);
    setNuevoEmpleado({ area: '', nombre: '', horas: 0 });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoEmpleado({ ...nuevoEmpleado, [name]: name === 'horas' ? parseFloat(value) : value });
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form-container">
      <select
        name="area"
        value={nuevoEmpleado.area}
        onChange={handleChange}
        className="custom-select"
      >
        <option value="">Seleccionar Área</option>
        {areas.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="nombre"
        value={nuevoEmpleado.nombre}
        onChange={handleChange}
        className="custom-input"
        placeholder="Nombre del Empleado"
      />
      <input
        type="number"
        name="horas"
        value={nuevoEmpleado.horas.toString()}
        onChange={handleChange}
        className="custom-input"
        placeholder="Horas trabajadas"
      />
      <button type="submit" className="custom-button">
        Agregar Empleado
      </button>
    </form>
  );
};

export default EmployeeForm;
