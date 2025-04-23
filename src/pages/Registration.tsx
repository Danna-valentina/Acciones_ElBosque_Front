import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputMask } from 'primereact/inputmask';

const Registration: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    //Validación del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }
    if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres.');
        return;
      }
    // Aquí puedes agregar la lógica para manejar el inicio de sesión
    //console.log('Iniciando sesión con:', { email, password });
    navigate('/LoginPage'); // Redirigir a la página de dashboard
  };

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: 'auto' }}>
      <h1>Iniciar Sesión</h1>
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="p-field">
            <label htmlFor="primer normbre">Primer nombre</label>
            <InputText id="primernombre" required/>
        </div>
            <div className="p-field">
            <label htmlFor="segundo nombre">Segundo Nombre</label>
            <InputText id="segundonombre" required />
        </div>
        <div className="p-field">
            <label htmlFor="primer apellido">Primer apellido</label>
            <InputText id="primerapellido"  required/>
        </div>
            <div className="p-field">
            <label htmlFor="segundo apellido">Segundo apellido</label>
            <InputText id="segundoapellido"  required/>
        </div>
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
        <div className="p-field">
            <label htmlFor="phone" className="font-bold block mb-2">Phone</label>
            <InputMask 
                id="phone" 
                mask="(999) 999-9999" 
                placeholder="(999) 999-9999">
            </InputMask>
        </div>
        <Button type="submit" label="registrar" className="p-button-primary" />
      </form>
    </div>
  );
};

export default Registration;