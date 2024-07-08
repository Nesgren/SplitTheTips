import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'react-feather';
import './TipAreaList.css';

// Definimos la interfaz para un empleado
interface Employee {
  nombre: string;
  horas: number;
  propinas: number;
}

// Definimos la interfaz para los datos de un área
interface AreaData {
  porcentaje: number;
  empleados: Employee[];
}

// Definimos la interfaz para las props del componente TipAreaList
interface TipAreaListProps {
  areas: Record<string, AreaData>; // Lista de áreas
  eliminarArea: (nombreArea: string) => void; // Función para eliminar un área
  editarEmpleado: (area: string, index: number, field: string, value: string | number) => void; // Función para editar un empleado
  eliminarEmpleado: (area: string, index: number) => void; // Función para eliminar un empleado
}

// Componente funcional TipAreaList
const TipAreaList: React.FC<TipAreaListProps> = ({ areas, eliminarArea, editarEmpleado, eliminarEmpleado }) => {
  // Estado para controlar el índice del empleado en edición
  const [editingEmployeeIndex, setEditingEmployeeIndex] = useState<{ area: string; index: number } | null>(null);

  // Maneja la edición de un empleado
  const handleEditEmployee = (area: string, index: number) => {
    setEditingEmployeeIndex({ area, index });
  };

  // Cancela la edición de un empleado
  const cancelEditEmployee = () => {
    setEditingEmployeeIndex(null);
  };

  // Guarda los cambios en el empleado editado
  const saveEditedEmployee = (area: string, index: number, field: string, value: string | number) => {
    editarEmpleado(area, index, field, value);
    setEditingEmployeeIndex(null);
  };

  // Renderiza las acciones (editar/guardar/cancelar/eliminar) para un empleado
  const renderEmployeeActions = (nombreArea: string, index: number, empleado: Employee) => {
    if (editingEmployeeIndex?.area === nombreArea && editingEmployeeIndex.index === index) {
      return (
        <>
          <input
            type="text"
            value={empleado.nombre}
            onChange={(e) => editarEmpleado(nombreArea, index, 'nombre', e.target.value)}
          />
          <input
            type="number"
            value={empleado.horas}
            onChange={(e) => editarEmpleado(nombreArea, index, 'horas', parseFloat(e.target.value))}
          />
          <button onClick={() => saveEditedEmployee(nombreArea, index, 'propinas', empleado.propinas)}>Guardar</button>
          <button onClick={cancelEditEmployee}>Cancelar</button>
        </>
      );
    } else {
      return (
        <>
          <button onClick={() => handleEditEmployee(nombreArea, index)}>Editar</button>
          <button onClick={() => eliminarEmpleado(nombreArea, index)}>Eliminar</button>
        </>
      );
    }
  };

  // Renderizado del componente
  return (
    <div className="tip-area-list">
      {Object.entries(areas).map(([nombreArea, datosArea]) => (
        <div key={nombreArea} className="tip-area-container">
          <div className="area-header">
            <h2 className="area-title">{nombreArea} ({datosArea.porcentaje}%)</h2>
            <button onClick={() => eliminarArea(nombreArea)} className="delete-area-button">
              <XCircle />
            </button>
          </div>
          <div className="grid-container">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="employee-table animate"
            >
              <div className="employee-cards">
                {datosArea.empleados.map((empleado, index) => (
                  <div key={index} className="employee-card">
                    <div className="employee-info">
                      <p><strong>Nombre:</strong> {empleado.nombre}</p>
                      <p><strong>Horas:</strong> {empleado.horas}</p>
                      <p><strong>Propinas:</strong> ${empleado.propinas.toFixed(2)}</p>
                    </div>
                    <div className="employee-actions">
                      {renderEmployeeActions(nombreArea, index, empleado)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TipAreaList;
