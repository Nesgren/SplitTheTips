export type Empleado = {
    nombre: string;
    horas: number;
    propinas: number;
  };

 export type Area = {
    porcentaje: number;
    empleados: Empleado[];
  };