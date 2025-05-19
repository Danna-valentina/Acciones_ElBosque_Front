import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';
import '../css/ProfileView.css';
import { UserProfile } from '../type/user';
import { UsuarioService } from '../service/UsuarioService';
import { error } from 'console';


const ProfileView: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'mensual' | 'anual'>('mensual');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tieneSuscripcion, setTieneSuscripcion] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const email = localStorage.getItem('email');
  console.log('Email:', email);
  const usuarioService = new UsuarioService();
  useEffect(() => {
    let isMounted = true;
    if (email) {
      setIsLoading(true);
      const fetchData = async () => {
        try {

          setIsLoading(true);
          const userData = await usuarioService.obtenerInfoPerfil(email);

          if (isMounted) setUser(userData);

          const tiene = await usuarioService.verificarSuscripcion(userData.email);
          if (isMounted) setTieneSuscripcion(tiene);

        } catch (error) {
          if (isMounted) {
            console.error('Error al cargar perfil o suscripcion:', error);
            setTieneSuscripcion(false);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      if (email) {
        fetchData();
      } else {
        setIsLoading(false); 
        console.error("No se encontró email en localStorage");
      }

      return () => {
        isMounted = false;
      };
    }
  }, [email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof UserProfile) => {
    if (user) {
      setUser({
        ...user,
        [field]: e.target.value
      });
    }
  };


  const handleSave = () => {
    if (user) {
      console.log('Datos guardados:', user);
      setEditMode(false);
    }
  };

  const handleCancel = () => {
    if (email) {
      setIsLoading(true);
      usuarioService.obtenerInfoPerfil(email)
        .then((data: UserProfile) => {
          setUser(data);
          setEditMode(false);
        })
        .catch(error => {
          console.error('Error al recuperar datos originales:', error);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handlePremiumPurchase = async () => {
  if (!user) return;

  try {
    const response = await usuarioService.enviarSuscripcion(selectedPlan);
    window.location.href = response;
  } catch (error) {
    console.error("Error al crear la suscripción:", error);
    alert("No se pudo redirigir a Stripe. Intenta nuevamente.");
  }
};

  if (isLoading || !user) {
    return (
      <div className="profile-loading">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div>
          <h2>Perfil de Usuario</h2>

        </div>
        <div>{!editMode ? (
          <Button
            label="Editar Perfil"
            icon="pi pi-pencil"
            className="p-button-text p-button-sm edit-button"
            onClick={() => setEditMode(true)}
          />
        ) : (
          <div className="edit-actions">
            <Button
              label="Guardar"
              icon="pi pi-check"
              className="p-button-success p-button-sm"
              onClick={handleSave}
              disabled={!user.primerNombre}
            />
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text p-button-sm"
              onClick={handleCancel}
            />
          </div>
        )}</div>
      </div>
      <div className="profile-content">
        <div className="profile-image-section">
          <div className="profile-image-container">
            <div className="empty-avatar">
              <i className="pi pi-user" style={{ fontSize: '4rem' }}></i>
            </div>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Primer Nombre:</span>
            {editMode ? (
              <InputText
                value={user.primerNombre}
                onChange={(e) => handleInputChange(e, 'primerNombre')}
                className="p-inputtext-sm"
                required
              />
            ) : (
              <span className="detail-value">{user.primerNombre}</span>
            )}
          </div>

          <div className="detail-row">
            <span className="detail-label">Segundo Nombre:</span>
            {editMode ? (
              <InputText
                value={user.segundoNombre}
                onChange={(e) => handleInputChange(e, 'segundoNombre')}
                className="p-inputtext-sm"
              />
            ) : (
              <span className="detail-value">{user.segundoNombre}</span>
            )}
          </div>

          <div className="detail-row">
            <span className="detail-label">Primer Apellido:</span>
            {editMode ? (
              <InputText
                value={user.primerApellido}
                onChange={(e) => handleInputChange(e, 'primerApellido')}
                className="p-inputtext-sm"
              />
            ) : (
              <span className="detail-value">{user.primerApellido}</span>
            )}
          </div>

          <div className="detail-row">
            <span className="detail-label">Segundo Apellido:</span>
            {editMode ? (
              <InputText
                value={user.segundoApellido}
                onChange={(e) => handleInputChange(e, 'segundoApellido')}
                className="p-inputtext-sm"
              />
            ) : (
              <span className="detail-value">{user.segundoApellido}</span>
            )}
          </div>

          <div className="detail-row">
            <span className="detail-label">Teléfono:</span>
            {editMode ? (
              <InputText
                value={user.telefono}
                onChange={(e) => handleInputChange(e, 'telefono')}
                className="p-inputtext-sm"
              />
            ) : (
              <span className="detail-value">{user.telefono}</span>
            )}
          </div>

          <div className="detail-row">
            <span className="detail-label">Estado:</span>
            <span className="detail-value">{user.estado}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Saldo:</span>
            <span className="detail-value">{user.saldo}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Moneda Base:</span>
            <span className="detail-value">{user.configuracion.monedaBase}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Recibir Notificaciones:</span>
            <span className="detail-value">{user.configuracion.recibirNotificaciones ? 'Sí' : 'No'}</span>
          </div>


          {/* Sección de Suscripción Premium */}
          {tieneSuscripcion === false &&(
            <div className="premium-subscription-section">
              <div className="premium-subscription-container">
                <h3>Suscripción Premium</h3>

                <div className="plan-options-container">
                  <div
                    className={`plan-option ${selectedPlan === 'mensual' ? 'plan-option-selected' : ''}`}
                    onClick={() => setSelectedPlan('mensual')}
                  >
                    <div className="plan-option-content">
                      <RadioButton
                        inputId="mensual"
                        name="plan"
                        value="mensual"
                        checked={selectedPlan === 'mensual'}
                        onChange={() => setSelectedPlan('mensual')}
                      />
                      <label htmlFor="mensual">Plan Mensual</label>
                    </div>
                    <div className="plan-price">$12.00 USD /mes</div>
                  </div>

                  <div
                    className={`plan-option ${selectedPlan === 'anual' ? 'plan-option-selected' : ''}`}
                    onClick={() => setSelectedPlan('anual')}
                  >
                    <div className="plan-option-content">
                      <RadioButton
                        inputId="anual"
                        name="plan"
                        value="anual"
                        checked={selectedPlan === 'anual'}
                        onChange={() => setSelectedPlan('anual')}
                      />
                      <label htmlFor="anual">Plan Anual</label>
                    </div>
                    <div className="plan-price">$120.00 USD año</div>
                  </div>
                </div>

                <Button
                  label={`Comprar ${selectedPlan === 'mensual' ? 'Plan Mensual' : 'Plan Anual'}`}
                  icon="pi pi-shopping-cart"
                  onClick={handlePremiumPurchase}
                  className="p-button-warning premium-purchase-button"
                />
              </div>
            </div>
          )}
          <div>
            <Button
              label={"Eliminar cuenta"}
              icon="pi pi-trash"
              // onClick=
              severity="danger" outlined
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;