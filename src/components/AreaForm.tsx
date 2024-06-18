// AreaForm.tsx
import React, { useState } from 'react';
import './AreaForm.css';

interface Area {
  nombre: string;
  porcentaje: number;
}

interface AreaFormProps {
  agregarArea: (nuevaArea: Area) => void;
  mostrarMensaje: (mensaje: string) => void;
  areasExistente: Area[];
}

const AreaForm: React.FC<AreaFormProps> = ({ agregarArea, mostrarMensaje, areasExistente }) => {
  const [nuevaArea, setNuevaArea] = useState<Area>({ nombre: '', porcentaje: NaN });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { nombre, porcentaje } = nuevaArea;

    if (!nombre.trim() || isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
      mostrarMensaje("Por favor, complete todos los campos correctamente y asegúrese de que el porcentaje esté entre 0 y 100.");
      return;
    }

    if (areasExistente.some(area => area.nombre === nombre)) {
      mostrarMensaje("El nombre del área ya existe. Por favor, elija un nombre único.");
      return;
    }

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
