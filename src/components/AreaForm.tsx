// AreaForm.tsx
import React, { useState } from 'react';
import './AreaForm.css';

// Definimos la interfaz para un área con nombre y porcentaje
interface Area {
  nombre: string;
  porcentaje: number;
}

// Definimos la interfaz para las props del componente AreaForm
interface AreaFormProps {
  agregarArea: (nuevaArea: Area) => void;
  mostrarMensaje: (mensaje: string) => void;
  areasExistente: Area[];
}

// Componente funcional AreaForm
const AreaForm: React.FC<AreaFormProps> = ({ agregarArea, mostrarMensaje, areasExistente }) => {
  // Estado para la nueva área a agregar
  const [nuevaArea, setNuevaArea] = useState<Area>({ nombre: '', porcentaje: NaN });

  // Manejador de envío del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { nombre, porcentaje } = nuevaArea;

    // Validación de los campos del formulario
    if (!nombre.trim() || isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
      mostrarMensaje("Por favor, complete todos los campos correctamente y asegúrese de que el porcentaje esté entre 0 y 100.");
      return;
    }

    // Verificar si el nombre del área ya existe
    if (areasExistente.some(area => area.nombre === nombre)) {
      mostrarMensaje("El nombre del área ya existe. Por favor, elija un nombre único.");
      return;
    }

    // Agregar la nueva área y resetear el formulario
    agregarArea(nuevaArea);
    setNuevaArea({ nombre: '', porcentaje: 0 });
  };

  
  return (
    <form onSubmit={handleSubmit} className="area-form-container">
      <input
        type="text"
        value={nuevaArea.nombre}
        onChange={(e) => setNuevaArea({ ...nuevaArea, nombre: e.target.value })}
        className="custom-input"
        placeholder="Nombre del Área"
      />
      <input
        type="number"
        value={nuevaArea.porcentaje.toString()}
        onChange={(e) => setNuevaArea({ ...nuevaArea, porcentaje: parseFloat(e.target.value) })}
        className="custom-input"
        placeholder="Porcentaje (%)"
      />
      <button type="submit" className="custom-button">
        Agregar Área
      </button>
    </form>
  );
};

export default AreaForm;
