// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  const handleLogin = () => {
    navigate('/LoginPage'); // Cambia '/login' por la ruta de tu página de inicio de sesión
  };

  const handleRegister = () => {
    navigate('/Registration'); // Cambia '/register' por la ruta de tu página de registro
  };

  return (
    <div className="home-container">
      <h1>Bienvenido a Acciones ElBosque</h1>
      <p>Tu plataforma de trading confiable y segura.</p>
      <div className="button-container">
        <button className="btn" onClick={handleLogin}>
          Iniciar Sesión
        </button>
        <button className="btn" onClick={handleRegister}>
          Registrarse
        </button>
      </div>
    </div>
  );
};

export default Home;