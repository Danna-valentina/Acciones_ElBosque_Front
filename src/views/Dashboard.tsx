import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { UserProfile } from '../type/user';
import '../css/Dashboard.css';


const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);


  return (
    <div className="dashboard-container">
      <div className="main-container">
        <div className="left-panel">
          <h2>Div 1</h2>
        </div>
        <div className="right-panel">
          <div className="orden-box">
            <h2>Manejo de ordenes</h2>
            <Button
              severity="success" raised
              icon="pi pi-shopping-cart"
              label='BUY'
            />
            <Button
              severity="danger" raised
              icon="pi pi-shop"
              label='SELL'

            />
          </div>
          <div className="saldo-box">
            <div>
              <h2>Saldo</h2>
              <span className="detail-value">1</span>
            </div>
            <div>
              <Button
                severity="warning" outlined
                icon="pi pi-wallet"
                label='Recargar'
              />
            </div>
          </div>
          <div className="detalles-box">
            <div >
              <h2>Ganancias:</h2>
              <span className="detail-value">1000</span>
            </div>
            <div>
              <h2>Perdidas: </h2>
              <span className="detail-value">10000</span>
            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

export default Dashboard;