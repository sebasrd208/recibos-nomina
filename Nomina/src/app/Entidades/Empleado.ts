export interface Empleado {
  idEmpleado: number;
  telefono: string;
  apellido: string;
  nombre: string;
  seccion: string;
  sueldo: string;
  numEmpleado:string;
}

export interface Compania {
  idCompania?: number;
  nombre: string;
  apellido: string;
  numEmpleado: string;
  rfc: string;
  compania: string;
  nota: string;
  trimestre: string;
}

export interface Deducciones {
  nombre?: string;
  bruto: string;
  ISR: string;
  IMSS: string;
  fondo: string;
  neto: string;
}

export interface Impuestos {
  nombre?: string;
  ISR: string;
  IMSS: string;
  impuesto: string;
}

export interface SueldoNeto {
  numEmpleado: string;
  datos: Compania[];
  deducciones: Deducciones[];
  impuestos: Impuestos[];
}