export interface Configuracion {
  monedaBase: Moneda;
  recibirNotificaciones: boolean;
}
export enum Moneda {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP'
}


export interface UserProfile {
  email: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  telefono: string;
  estado: string;
  saldo: number;
  configuracion: Configuracion;
}
export interface UsuarioRequest {
  email: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  telefono: string;
  contrasena: string;
  moneda: Moneda;
  notificaciones:boolean;
}

