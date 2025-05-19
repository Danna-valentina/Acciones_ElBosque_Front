import axios from 'axios';
import { UserProfile, UsuarioRequest } from '../type/user';

export interface EmailDTO {
  email: string;
  password: string;
}
export class UsuarioService {
  private baseURL = 'http://localhost:8081/usuario/';
  enviarCorreo(usuario: EmailDTO): Promise<string> {
    return axios.post(this.baseURL + 'enviarcorreo', usuario, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.data)
      .catch(error => {
        console.error("[DEBUG] Error completo:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });
        throw error;
      });
  }

 crearUsuario(usuario: UsuarioRequest): Promise<string> {
  return axios.post(this.baseURL + 'crear', usuario, {
    headers: { 'Content-Type': 'application/json' },
  })
  .then(res => res.data)
  .catch(error => {
    console.error("Error creando usuario:", error.response?.data || error.message);
    throw error;
  });
}

verificarSuscripcion(idUsuario: string): Promise<boolean> {
  return axios.get(this.baseURL + 'buscarSuscripcion/${idUsuario}')
    .then(res => res.data)
    .catch(error => {
      console.error('Error verificando suscripción:', error.response?.data || error.message);
      throw error;
    });
}

  async enviarSuscripcion(plan:String):Promise<string>{
   const response = await axios.post(this.baseURL + 'crearSuscripcion',{
    plan: plan
   });
   return response.data.url
 }

  obtenerInfoPerfil(email: string): Promise<UserProfile> {
    return axios.get(`${this.baseURL}listar?email=${email}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.data as UserProfile)
      .catch(error => {
        console.error('Error fetching user profile:', error);
        throw error; // Re-lanzar el error para manejo superior
      });
  }

  verificarCodigo(correo: string, codigo: string): Promise<string> {
    return axios.post(this.baseURL + 'verificarCodigo', null, {
      params: {
        correo: correo,
        codigo: codigo
      }
    }).then(res => res.data);
  }

  crearSuscripcion(plan: string): Promise<{ url: string }> {
    return axios.post(this.baseURL + 'crearSuscripcion', null, {
      params: {
        plan: plan
      }
    }).then(res => res.data.url);

  }


}

