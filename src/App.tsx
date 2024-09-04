import React, { useState, useEffect, useCallback } from 'react';
import AreaForm from './components/AreaForm';
import EmployeeForm from './components/EmployeeForm';
import TipAreaList from './components/TipAreaList';
import ErrorMessage from './components/ErrorMessage';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const MAX_PERCENTAGE = 100;

type Area = {
  porcentaje: number;
  empleados: {
    nombre: string;
    horas: number;
    propinas: number;
  }[];
};

type ActionButtonProps = {
  isVisible: boolean;
  onClick: () => void;
  label: string;
};

const cargarAreasDesdeLocalStorage = () => {
  try {
    const areasGuardadas = localStorage.getItem('areas');
    return areasGuardadas ? JSON.parse(areasGuardadas) : {};
  } catch (error) {
    console.error('Error al cargar desde localStorage:', error);
    return {};
  }
};

const guardarAreasEnLocalStorage = (nuevasAreas: Record<string, Area>) => {
  try {
    localStorage.setItem('areas', JSON.stringify(nuevasAreas));
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
};

const ActionButton = React.memo(({ isVisible, onClick, label }: ActionButtonProps) => {
  if (!isVisible) return null;
  return (
    <button className="add-button custom-button" onClick={onClick}>
      {label}
    </button>
  );
});

const App: React.FC = () => {
  const [areas, setAreas] = useState<Record<string, Area>>(cargarAreasDesdeLocalStorage());
  const [totalPropinas, setTotalPropinas] = useState<number>(0);
  const [mensajeError, setMensajeError] = useState<string>('');
  const [mostrarFormulario, setMostrarFormulario] = useState<'area' | 'empleado' | null>(null);

  useEffect(() => {
    guardarAreasEnLocalStorage(areas);
  }, [areas]);

  const mostrarMensaje = useCallback((mensaje: string) => {
    setMensajeError(mensaje);
    setTimeout(() => {
      setMensajeError('');
    }, 2000);
  }, []);

  const actionButtons = [
    {
      isVisible: !mostrarFormulario,
      onClick: () => setMostrarFormulario('area'),
      label: 'Agregar Área',
    },
    {
      isVisible: !mostrarFormulario,
      onClick: () => setMostrarFormulario('empleado'),
      label: 'Agregar Empleado',
    },
    {
      isVisible: mostrarFormulario === 'area',
      onClick: () => setMostrarFormulario(null),
      label: 'Ocultar Área',
    },
    {
      isVisible: mostrarFormulario === 'empleado',
      onClick: () => setMostrarFormulario(null),
      label: 'Ocultar Empleado',
    },
  ];

  const agregarArea = useCallback((nuevaArea: { nombre: string; porcentaje: number }) => {
    const { nombre, porcentaje } = nuevaArea;
    if (!nombre.trim() || isNaN(porcentaje) || porcentaje === 0) {
      mostrarMensaje("Por favor, complete todos los campos correctamente.");
      return;
    }

    const totalPorcentaje = Object.values(areas).reduce((acc, curr) => acc + curr.porcentaje, 0);
    if (totalPorcentaje + porcentaje > MAX_PERCENTAGE) {
      mostrarMensaje("La suma de los porcentajes de las áreas no puede superar el 100%.");
      return;
    }

    setAreas(prevAreas => ({
      ...prevAreas,
      [nombre]: { porcentaje, empleados: [] }
    }));
    mostrarMensaje("Área agregada exitosamente.");
  }, [areas, mostrarMensaje]);

  const agregarEmpleado = useCallback((nuevoEmpleado: { area: string; nombre: string; horas: number }) => {
    const { area, nombre, horas } = nuevoEmpleado;
    if (!area || !nombre.trim() || isNaN(horas) || horas === 0) {
      mostrarMensaje("Por favor, complete todos los campos correctamente.");
      return;
    }

    if (!areas[area]) {
      mostrarMensaje("El área seleccionada no existe.");
      return;
    }

    if (areas[area].empleados.some(empleado => empleado.nombre === nombre)) {
      mostrarMensaje("Ya existe un empleado con ese nombre en esta área.");
      return;
    }

    setAreas(prevAreas => ({
      ...prevAreas,
      [area]: { 
        ...prevAreas[area],
        empleados: [...prevAreas[area].empleados, { nombre, horas, propinas: 0 }]
      }
    }));
    mostrarMensaje("Empleado agregado exitosamente.");
  }, [areas, mostrarMensaje]);

  const eliminarArea = useCallback((nombreArea: string) => {
    setAreas(prevAreas => {
      const nuevasAreas = { ...prevAreas };
      delete nuevasAreas[nombreArea];
      return nuevasAreas;
    });
    mostrarMensaje("Área eliminada exitosamente.");
  }, [mostrarMensaje]);

  const editarEmpleado = useCallback((area: string, index: number, field: string, value: string | number) => {
    setAreas(prevAreas => {
      const nuevasAreas = { ...prevAreas };
      if (field === 'nombre') {
        nuevasAreas[area].empleados[index].nombre = value as string;
      } else if (field === 'horas') {
        nuevasAreas[area].empleados[index].horas = parseFloat(value as string);
      }
      return nuevasAreas;
    });
    mostrarMensaje("Empleado actualizado exitosamente.");
  }, [mostrarMensaje]);

  const eliminarEmpleado = useCallback((area: string, index: number) => {
    setAreas(prevAreas => {
      const nuevasAreas = { ...prevAreas };
      nuevasAreas[area].empleados.splice(index, 1);
      return nuevasAreas;
    });
    mostrarMensaje("Empleado eliminado exitosamente.");
  }, [mostrarMensaje]);

  const calcularDistribucion = useCallback(() => {
    const totalPorcentaje = Object.values(areas).reduce((acc, curr) => acc + curr.porcentaje, 0);
    if (totalPorcentaje !== MAX_PERCENTAGE) {
      mostrarMensaje("La suma de los porcentajes de las áreas debe ser 100%.");
      return;
    }

    setAreas(prevAreas => {
      const nuevasAreas = { ...prevAreas };
      Object.entries(prevAreas).forEach(([nombreArea, datosArea]) => {
        const propinasPorArea = (totalPropinas * datosArea.porcentaje) / MAX_PERCENTAGE;
        const totalHoras = datosArea.empleados.reduce((acc, empleado) => acc + empleado.horas, 0);
        nuevasAreas[nombreArea] = {
          ...datosArea,
          empleados: datosArea.empleados.map(empleado => ({
            ...empleado,
            propinas: totalHoras > 0 ? (propinasPorArea * empleado.horas) / totalHoras : 0,
          })),
        };
      });
      return nuevasAreas;
    });
    mostrarMensaje("Distribución calculada exitosamente.");
  }, [areas, totalPropinas, mostrarMensaje]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <header>
        <div className="app-title">
          <span className="text">&nbsp;Split The Tips &nbsp;</span>
          <span className="hover-text">&nbsp;Split The Tips &nbsp;</span>
        </div>
      </header>
      <div className="content">
        <div className="box">
          <div className="box-content">
            <div className="total-propinas">
              <div className="input-wrapper">
                <input
                  value={totalPropinas.toString()}
                  onChange={(e) => setTotalPropinas(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                  placeholder="Total de Propinas"
                />
                <label htmlFor="number">Total de propinas</label>
                <div className="underline"></div>
              </div>
              <button className="add-button custom-button" onClick={calcularDistribucion}>
                Repartir Propinas
              </button>
              {mensajeError && <ErrorMessage mensajeError={mensajeError} />}
              <div className="actions">
                {actionButtons.map((btn, index) => (
                  <ActionButton
                    key={index}
                    isVisible={btn.isVisible}
                    onClick={btn.onClick}
                    label={btn.label}
                  />
                ))}
              </div>
              <AnimatePresence>
                {mostrarFormulario && (
                  <motion.div className="slide-enter" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    {mostrarFormulario === 'area' && (
                      <AreaForm agregarArea={agregarArea} mostrarMensaje={setMensajeError} areasExistente={[]} />
                    )}
                    {mostrarFormulario === 'empleado' && (
                      <EmployeeForm areas={Object.keys(areas)} agregarEmpleado={agregarEmpleado} mostrarMensaje={setMensajeError} />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {Object.keys(areas).length > 0 ? (
              <TipAreaList areas={areas} eliminarArea={eliminarArea} editarEmpleado={editarEmpleado} eliminarEmpleado={eliminarEmpleado} />
            ) : (
              <div className="no-areas">
                <p>No hay áreas. Por favor, agrega una área para comenzar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default App;
