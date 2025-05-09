import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
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
  // Datos de ejemplo estáticos (luego se reemplazarán con props)
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
    // Aquí iría la lógica para guardar los cambios
    console.log('Datos guardados:', user);
    setEditMode(false);
  };

  const handleCancel = () => {
    // Restaurar valores originales (en una implementación real, esto vendría de los props)
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
        <h2>Perfil de Usuario</h2>
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
              disabled={!user.primerNombre} // Validación básica
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
      
      <Divider />

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
        </div>
      </div>
    </div>
  );
};

export default ProfileView;