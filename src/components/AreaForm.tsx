import React, { useState, useCallback } from 'react';
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
  
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { nombre, porcentaje } = nuevaArea;

    if (!nombre.trim()) {
      mostrarMensaje("El nombre del área no puede estar vacío.");
      return;
    }

    if (isNaN(porcentaje)) {
      mostrarMensaje("El porcentaje debe ser un número válido.");
      return;
    }

    if (porcentaje < 0 || porcentaje > 100) {
      mostrarMensaje("El porcentaje debe estar entre 0 y 100.");
      return;
    }

    if (areasExistente.some(area => area.nombre === nombre)) {
      mostrarMensaje("El nombre del área ya existe. Por favor, elija un nombre único.");
      return;
    }

    // Verificar si el porcentaje es 0 o un valor no válido
    if (porcentaje === 0) {
      mostrarMensaje("El porcentaje debe ser mayor que 0.");
      return;
    }

    // Verificar si el porcentaje excede el límite permitido
    const totalPorcentajeExistente = areasExistente.reduce((sum, area) => sum + area.porcentaje, 0);
    if (totalPorcentajeExistente + porcentaje > 100) {
      mostrarMensaje("La suma total de los porcentajes no puede exceder el 100%.");
      return;
    }

    agregarArea(nuevaArea);
    setNuevaArea({ nombre: '', porcentaje: 0 });
  }, [nuevaArea, agregarArea, mostrarMensaje, areasExistente]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'nombre') {
      setNuevaArea(prev => ({ ...prev, [name]: value }));
    } else if (name === 'porcentaje') {
      let porcentaje = parseFloat(value);
      // Calcular el total actual de porcentajes de las áreas existentes
      const totalPorcentajeExistente = areasExistente.reduce((sum, area) => sum + area.porcentaje, 0);
      // Asegurarse de que el porcentaje no exceda el límite disponible
      if (totalPorcentajeExistente + porcentaje > 100) {
        porcentaje = 100 - totalPorcentajeExistente;
      }
      setNuevaArea(prev => ({ ...prev, [name]: isNaN(porcentaje) ? 0 : porcentaje }));
    }
  }, [areasExistente]);

  return (
    <form onSubmit={handleSubmit} className="area-form-container">
      <input
        type="text"
        name="nombre"
        value={nuevaArea.nombre}
        onChange={handleInputChange}
        className="custom-input"
        placeholder="Nombre del Área"
      />
      <input
        type="number"
        name="porcentaje"
        value={nuevaArea.porcentaje.toString()}
        onChange={handleInputChange}
        className="custom-input"
        placeholder="Porcentaje (%)"
        min="0"
        max="100"
      />
      <button type="submit" className="custom-button">
        Agregar Área
      </button>
    </form>
  );
};

export default AreaForm;
