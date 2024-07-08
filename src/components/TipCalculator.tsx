import React from 'react';
import './TipCalculator.css';
import EmployeeForm from './EmployeeForm';

// Definimos la interfaz para las props del componente TipCalculator
interface TipCalculatorProps {
  areas: Record<string, { porcentaje: number; empleados: { nombre: string; horas: number; propinas: number }[] }>;
}

// Componente funcional TipCalculator
const TipCalculator: React.FC<TipCalculatorProps> = ({ areas }) => {
  // Función para agregar un nuevo empleado
  const agregarEmpleado = (nuevoEmpleado: { area: string; nombre: string; horas: number }) => {
    console.log(`Nuevo empleado agregado: ${nuevoEmpleado.nombre}`);
  };

  // Obtenemos un array con los nombres de las áreas
  const areasArray = Object.keys(areas);

  // Renderizado del componente
  return (
    <div className="tip-calculator">
      <h1>Calculadora de Propinas</h1>
      <EmployeeForm
        areas={areasArray} // Pasamos el array de áreas al componente EmployeeForm
        agregarEmpleado={agregarEmpleado} // Pasamos la función para agregar empleado al componente EmployeeForm
        mostrarMensaje={(mensaje) => {
          console.error(`Error: ${mensaje}`); // Mostramos un mensaje de error en la consola
        }}
      />
    </div>
  );
};

export default TipCalculator;
