// src/components/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { UsuarioService,UsuarioDTO } from '../service/UsuarioService';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState('');
  const [codeError, setCodeError] = useState('');
  const navigate = useNavigate()
  const usuarioService = new UsuarioService();

  const handleLogin = async(event: React.FormEvent) => {
    event.preventDefault();
    //Validación del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }
    // Validación de la contraseña
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    const usuario: UsuarioDTO = {
      email: email,
      contrasena: password
    };
    // Aquí puedes agregar la lógica para manejar el inicio de sesión
    console.log('Iniciando sesión con:', { email, password });
    try {
      
      const respuesta = await usuarioService.enviarCorreo(usuario);
      console.log(respuesta); // "Código enviado al correo"
     
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("El correo no está registrado");
      } else {
        setError("Ocurrió un error al enviar el correo");
      }
    }

    setError('');
    setShowDialog(true);
  };

  const handleVerification = async() => {
    const codeRegex = /^\d{6}$/;
    if (!codeRegex.test(verificationCode)) {
      setCodeError('El código debe contener exactamente 6 dígitos numéricos.');
      return;
    }
    
    try{
      const token = await usuarioService.verificarCodigo(email, verificationCode);
      console.log("Token recibido:", token);
      localStorage.setItem("token", token);
    
    setCodeError('');
    console.log('Código verificado:', verificationCode);
    setShowDialog(false);
    navigate('/Dashboard');
    }catch (error: any) {
      if (error.response?.status === 401) {
        setCodeError("Código incorrecto o expirado");
      } else {
        setCodeError("Error al verificar el código");
      }
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: 'auto' }}>
      <h1>Iniciar Sesión</h1>
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="p-field">
          <label htmlFor="email">Correo Electrónico</label>
          <InputText
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="p-field">
          <label htmlFor="password">Contraseña</label>
          <Password
            inputId="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
          />
        </div>
        <Button type="submit" label="Iniciar Sesión" className="p-button-primary" />
      </form>
      <p>
        <a href="/recover-password">¿Olvidaste tu contraseña?</a>
      </p>
      <Dialog
        header="Verificación de Código"
        visible={showDialog}
        style={{ width: '350px' }}
        modal
        closable={false}
        onHide={() => setShowDialog(false)}
        footer={
          <div>
            <Button label="Verificar" onClick={handleVerification} autoFocus />
          </div>
        }
      >
        <p>Ingresa el código de verificación de 6 dígitos que recibiste:</p>
        <InputText
          value={verificationCode}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setVerificationCode(value);
            }
          }}
          maxLength={6}
        />

        {codeError && <p style={{ color: 'red' }}>{codeError}</p>}
      </Dialog>
    </div>
  );
};

export default Login;