import axios from 'axios';

export interface UsuarioDTO{
    email:string;
    contrasena:string;
}
export class UsuarioService{
    private baseURL = 'http://localhost:8081/usuario/';
    enviarCorreo(usuario:UsuarioDTO): Promise<string>{
        return axios.post(this.baseURL+ 'enviarcorreo',usuario)
        .then(res => res.data); 
    }
    
    verificarCodigo(correo: string, codigo: string): Promise<string> {
        return axios.post(this.baseURL + 'verificarCodigo', null, {
          params: {
            correo: correo,
            codigo: codigo
          }
        }).then(res => res.data);
      }
       
    
}

