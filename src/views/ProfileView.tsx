import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';
import '../css/ProfileView.css';

interface UserProfile {
  email: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  telefono: string;
  estado: string;
  rol: string;
  saldo: number;
  lastAccess?: string;
}

interface ProfileViewProps {
  loading?: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  loading = false
}) => {
  const [editMode, setEditMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'mensual' | 'anual'>('mensual');
  
  // Datos de ejemplo estáticos
  const [user, setUser] = useState<UserProfile>({ 
    email: 'usuario@ejemplo.com',
    primerNombre: 'Juan',
    segundoNombre: 'Carlos',
    primerApellido: 'Pérez',
    segundoApellido: 'Gómez',
    telefono: '555-1234',
    estado: 'Activo',
    rol: 'Usuario',
    saldo: 1000,
    lastAccess: '2023-05-15 14:30'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof UserProfile) => {
    setUser({ ...user, [field]: e.target.value });
  };

  const handleSave = () => {
    console.log('Datos guardados:', user);
    setEditMode(false);
  };

  const handleCancel = () => {
    setUser({ 
      email: 'usuario@ejemplo.com',
      primerNombre: 'Juan',
      segundoNombre: 'Carlos',
      primerApellido: 'Pérez',
      segundoApellido: 'Gómez',
      telefono: '555-1234',
      estado: 'Activo',
      rol: 'Usuario',
      saldo: 1000,
      lastAccess: '2023-05-15 14:30'
    });
    setEditMode(false);
  };

  const handlePremiumPurchase = () => {
    alert(`Redirigiendo a compra del plan ${selectedPlan === 'mensual' ? 'mensual ($9.99)' : 'anual ($99.99)'}`);
  };

  if (loading) {
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
            <span className="detail-label">Rol:</span>
            <span className="detail-value">{user.rol}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Saldo:</span>
            <span className="detail-value">{user.saldo}</span>
          </div>

                    {/* Sección de Suscripción Premium */}
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
    </div>
  );
};

export default ProfileView;