// ErrorMessage.tsx
import React, { useState, useEffect } from 'react';
import './ErrorMessage.css';

// Definimos la interfaz para las props del componente ErrorMessage
interface ErrorMessageProps {
  mensajeError: string;
}

// Componente funcional ErrorMessage
const ErrorMessage: React.FC<ErrorMessageProps> = ({ mensajeError }) => {
  // Estado para controlar la visibilidad del mensaje de error
  const [visible, setVisible] = useState(true);

  // Efecto que oculta el mensaje después de 5 segundos
  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 5000);

    // Limpiar el timeout al desmontar el componente o cambiar el mensaje de error
    return () => clearTimeout(timeout);
  }, [mensajeError]);

  // Si no hay mensaje de error, no renderizar nada
  if (!mensajeError) {
    return null;
  }

  // Renderizado del mensaje de error
  return (
    <div className={`custom-error-message ${visible ? 'show' : ''}`}>
      {mensajeError}
    </div>
  );
};

export default ErrorMessage;
