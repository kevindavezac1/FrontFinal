import { Usuario } from "./usuario.interface";

// usuario-response.interface.ts
export interface UsuarioResponse {
  codigo: number;
  mensaje: string;
  payload: Usuario[];  // Asume que 'payload' es un array de usuarios
}