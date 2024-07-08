import React, { useState, useEffect } from 'react';
import AreaForm from './components/AreaForm';
import EmployeeForm from './components/EmployeeForm';
import TipAreaList from './components/TipAreaList';
import ErrorMessage from './components/ErrorMessage';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Definimos el valor máximo permitido para el porcentaje total de áreas
const MAX_PERCENTAGE = 100;

const App: React.FC = () => {
  // Definimos el tipo para una área con su porcentaje y lista de empleados
  type Area = {
    porcentaje: number;
    empleados: {
      nombre: string;
      horas: number;
      propinas: number;
    }[];
  };

  // Estado para almacenar las áreas
  const [areas, setAreas] = useState<Record<string, Area>>({});

  // Estado para almacenar el total de propinas
  const [totalPropinas, setTotalPropinas] = useState<number>(0);

  // Estado para almacenar los mensajes de error
  const [mensajeError, setMensajeError] = useState<string>('');

  // Estados para controlar la visibilidad de los formularios
  const [mostrarAgregarArea, setMostrarAgregarArea] = useState<boolean>(false);
  const [mostrarAgregarEmpleado, setMostrarAgregarEmpleado] = useState<boolean>(false);

  // useEffect para cargar las áreas desde el localStorage al montar el componente
  useEffect(() => {
    const cargarAreasDesdeLocalStorage = () => {
      try {
        const areasGuardadas = localStorage.getItem('areas');
        return areasGuardadas ? JSON.parse(areasGuardadas) : {};
      } catch (error) {
        console.error('Error al cargar desde localStorage:', error);
        return {};
      }
    };

    const areasGuardadas = cargarAreasDesdeLocalStorage();
    if (areasGuardadas && Object.keys(areasGuardadas).length > 0) {
      setAreas(areasGuardadas);
    }
  }, []);

  // Función para guardar las áreas en el localStorage
  const guardarAreasEnLocalStorage = (nuevasAreas: Record<string, Area>) => {
    try {
      localStorage.setItem('areas', JSON.stringify(nuevasAreas));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  };

  // Función para mostrar mensajes de error por un tiempo determinado
  const mostrarMensaje = (mensaje: string) => {
    setMensajeError(mensaje);
    setTimeout(() => {
      setMensajeError('');
    }, 3000);
  };

  // Función para agregar una nueva área
  const agregarArea = (nuevaArea: { nombre: string; porcentaje: number }) => {
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

    const nuevasAreas = { ...areas, [nombre]: { porcentaje, empleados: [] } };
    actualizarAreas(nuevasAreas);
    mostrarMensaje("Área agregada exitosamente.");
  };

  // Función para agregar un nuevo empleado a una área
  const agregarEmpleado = (nuevoEmpleado: { area: string; nombre: string; horas: number }) => {
    const { area, nombre, horas } = nuevoEmpleado;
    if (!area || !nombre.trim() || isNaN(horas) || horas === 0) {
      mostrarMensaje("Por favor, complete todos los campos correctamente.");
      return;
    }

    if (!areas[area]) {
      mostrarMensaje("El área seleccionada no existe.");
      return;
    }

    const empleadoExistente = areas[area].empleados.find(empleado => empleado.nombre === nombre);
    if (empleadoExistente) {
      mostrarMensaje("Ya existe un empleado con ese nombre en esta área.");
      return;
    }

    const nuevoEmpleadoData = { nombre, horas, propinas: 0 };
    const nuevasAreas = { ...areas, [area]: { ...areas[area], empleados: [...areas[area].empleados, nuevoEmpleadoData] } };
    actualizarAreas(nuevasAreas);
    mostrarMensaje("Empleado agregado exitosamente.");
  };

  // Función para eliminar una área
  const eliminarArea = (nombreArea: string) => {
    const nuevasAreas = { ...areas };
    delete nuevasAreas[nombreArea];
    actualizarAreas(nuevasAreas);
    mostrarMensaje("Área eliminada exitosamente.");
  };

  // Función para actualizar el estado de las áreas y guardar en localStorage
  const actualizarAreas = (nuevasAreas: Record<string, Area>) => {
    setAreas(nuevasAreas);
    guardarAreasEnLocalStorage(nuevasAreas);
  };

  // Función para editar los datos de un empleado
  const editarEmpleado = (area: string, index: number, field: string, value: string | number) => {
    const nuevasAreas = { ...areas };
    if (field === 'nombre') {
      nuevasAreas[area].empleados[index].nombre = value as string;
    } else if (field === 'horas') {
      nuevasAreas[area].empleados[index].horas = parseFloat(value as string);
    }
    actualizarAreas(nuevasAreas);
    mostrarMensaje("Empleado actualizado exitosamente.");
  };

  // Función para eliminar un empleado de una área
  const eliminarEmpleado = (area: string, index: number) => {
    const nuevasAreas = { ...areas };
    nuevasAreas[area].empleados.splice(index, 1);
    actualizarAreas(nuevasAreas);
    mostrarMensaje("Empleado eliminado exitosamente.");
  };

  // Función para calcular la distribución de las propinas entre los empleados
  const calcularDistribucion = () => {
    const totalPorcentaje = Object.values(areas).reduce((acc, curr) => acc + curr.porcentaje, 0);
    if (totalPorcentaje !== MAX_PERCENTAGE) {
      mostrarMensaje("La suma de los porcentajes de las áreas debe ser 100%.");
      return;
    }

    const propinasTotales = totalPropinas;
    const nuevasAreas: typeof areas = {};

    Object.entries(areas).forEach(([nombreArea, datosArea]) => {
      const propinasPorArea = (propinasTotales * datosArea.porcentaje) / MAX_PERCENTAGE;
      const totalHoras = datosArea.empleados.reduce((acc, empleado) => acc + empleado.horas, 0);

      const nuevosEmpleados = datosArea.empleados.map(empleado => ({
        ...empleado,
        propinas: (propinasPorArea * empleado.horas) / totalHoras
      }));

      nuevasAreas[nombreArea] = { ...datosArea, empleados: nuevosEmpleados };
    });

    actualizarAreas(nuevasAreas);
    mostrarMensaje("Distribución calculada exitosamente.");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header>
        <div className="app-title">
          <span className="text">&nbsp;Split The Tips &nbsp;</span>
          <span className="hover-text">&nbsp;Split The Tips &nbsp;</span>
        </div>
      </header>
      <div className="content">
        <div className="box">
          <div className="box-content">
            <div className="actions">
              <button
                className='add-button custom-button'
                onClick={() => {
                  setMostrarAgregarArea(!mostrarAgregarArea);
                  setMostrarAgregarEmpleado(false);
                }}
              >
                {mostrarAgregarArea ? 'Ocultar' : 'Agregar'} Área
              </button>
              <button
                className='add-button custom-button'
                onClick={() => {
                  setMostrarAgregarEmpleado(!mostrarAgregarEmpleado);
                  setMostrarAgregarArea(false);
                }}
              >
                {mostrarAgregarEmpleado ? 'Ocultar' : 'Agregar'} Empleado
              </button>
            </div>
            <AnimatePresence>
              {(mostrarAgregarArea || mostrarAgregarEmpleado) && (
                <motion.div
                  className="slide-enter"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {mostrarAgregarArea && (
                    <AreaForm agregarArea={agregarArea} mostrarMensaje={setMensajeError} areasExistente={[]} />
                  )}
                  {mostrarAgregarEmpleado && (
                    <EmployeeForm areas={Object.keys(areas)} agregarEmpleado={agregarEmpleado} mostrarMensaje={setMensajeError} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="box">
          <div className="box-content">
            <div className="total-propinas">
              <div className='input-wrapper'>
                <input
                  value={totalPropinas.toString()}
                  onChange={(e) => {
                    const inputValue = e.target.value.trim();
                    setTotalPropinas(inputValue === '' ? 0 : parseFloat(inputValue));
                  }}
                  placeholder="Total de Propinas"
                />
                <label htmlFor="number">Total de propinas</label>
                <div className='underline'></div>
              </div>
              <button className='add-button custom-button' onClick={calcularDistribucion}>
                Repartir Propinas
              </button>
            </div>
          </div>
        </div>
        {mensajeError && (
          <ErrorMessage mensajeError={mensajeError} />
        )}
        <div className="box">
          <div className="box-content">
            <AnimatePresence>
              <TipAreaList
                areas={areas}
                eliminarArea={eliminarArea}
                editarEmpleado={editarEmpleado}
                eliminarEmpleado={eliminarEmpleado}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default App;
