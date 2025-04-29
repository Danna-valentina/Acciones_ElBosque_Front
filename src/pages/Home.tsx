// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom';
import logo from '../images/Logo.png';
import velas from '../images/velas.jpg'; // Asegúrate de tener esta imagen en tu carpeta images
import '../css/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/LoginPage');
  };

  const handleRegister = () => {
    navigate('/Registration');
  };

  return (
    <div className="home-container">
      <div className="header">
        <div className="logo">
          <img src={logo} alt="Acciones ElBosque" className="logo-image" />
        </div>
        <div className="auth-buttons">
          <button className="auth-btn login-btn" onClick={handleLogin} >
            Iniciar Sesión
          </button>
          <button className="auth-btn register-btn" onClick={handleRegister}>
            Registrarse
          </button>
        </div>
      </div>
      
      <div className="content-wrapper">
        <div className="hero-content">
          <h1>Invierte en Acciones con Acciones ElBosque</h1>
          <p className="hero-subtitle">
            Opera con condiciones competitivas y elige entre cientos de empresas en los mercados globales.
          </p>
          <div className="cta-section">
            <button className="cta-button" onClick={handleRegister}>
              ABRIR UNA CUENTA
            </button>
          </div>
        </div>
        <div className="image-section">
          <img src={velas} alt="Gráfico de velas" className="velas-image" />
        </div>
      </div>
    </div>
  );
};

export default Home;