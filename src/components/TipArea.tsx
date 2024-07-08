import React from 'react';
import { XCircle } from 'react-feather';
import './TipArea.css';

// Definimos la interfaz para las props del componente TipArea
interface TipAreaProps {
  area: string; // Nombre del área
  data: Area; // Datos del área
  eliminarArea: (nombreArea: string) => void; // Función para eliminar un área
  actualizarHoras: (area: string, index: number, horas: number) => void; // Función para actualizar las horas trabajadas
}

// Definimos la interfaz para un área
interface Area {
  porcentaje: number; // Porcentaje del área
  empleados: Employee[]; // Lista de empleados en el área
}

// Definimos la interfaz para un empleado
interface Employee {
  nombre: string; // Nombre del empleado
  horas: number; // Horas trabajadas por el empleado
  propinas: number; // Propinas asignadas al empleado
}

// Componente funcional TipArea
const TipArea: React.FC<TipAreaProps> = ({ area, data, eliminarArea, actualizarHoras }) => {
  // Manejador de cambio de horas trabajadas
  const handleHorasChange = (index: number, value: string) => {
    const nuevasHoras = parseFloat(value) || 0; // Convertir el valor a número, o 0 si no es válido
    actualizarHoras(area, index, nuevasHoras); // Actualizar las horas trabajadas
  };

  // Renderizado del componente
  return (
    <div className="custom-tip-area">
      <div className="tip-area-header">
        <h3 className="area-title">{area} ({data.porcentaje}%)</h3>
        <button onClick={() => eliminarArea(area)} className="delete-button">
          <XCircle />
        </button>
      </div>
      <div className="employee-list">
        {data.empleados.map((employee, index) => (
          <div key={index} className="employee-info">
            <div className="employee-details">
              <div className="employee-name">{employee.nombre}</div>
              <input
                type="number"
                value={employee.horas}
                onChange={(e) => handleHorasChange(index, e.target.value)}
                className="hours-input"
                placeholder="Horas"
              />
              <p className="tips-amount">${employee.propinas.toFixed(2)}</p>
            </div>
            <div className="details-labels">
              <div className="hours-label">Horas Trabajadas</div>
              <div className="tips-label">Propinas Asignadas</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipArea;
