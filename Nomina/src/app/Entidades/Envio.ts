export interface ResultadoEnvio {
  correosEnviados: string[];
  correosFallidos: string[];
  totalEnviados: number;
  totalFallidos: number;
  tiempoEjecucionMs: number;
}

export interface Envio {
  numEmpleado: string;
  correoEnviado: string;
  tiempoEjecucionMs: number;
}