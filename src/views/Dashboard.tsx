import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';


import '../css/Dashboard.css';


const Dashboard: React.FC = () => {

  const [showRecargaDialog, setShowRecargaDialog] = useState(false);
  const [value1, setValue1] = useState<number>(0); // Tipo number, no string

  return (
    <div className="dashboard-container">
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
          <div >
            <Button
              severity="warning" outlined
              icon="pi pi-wallet"
              label='Recargar'
              onClick={() => setShowRecargaDialog(true)}

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

      <Dialog
        header="Recargar Saldo"
        // className="recarga-dialog"
        visible={showRecargaDialog}
        onHide={() => setShowRecargaDialog(false)}
      >
        <div className="p-fluid">
          <h3>Ingrese el monto a recargar:</h3>
          <div className="card flex flex-wrap gap-3 p-fluid" >
            <div className="flex-auto">
              <label htmlFor="stacked-buttons" className="font-bold block mb-2"></label>
              <InputNumber
                inputId="stacked-buttons"
                value={value1}
                onValueChange={(e) => setValue1(e.value || 0)}
                showButtons={false}  // Desactiva los botones
                mode="decimal"  // Cambia de 'currency' a 'decimal'
                minFractionDigits={2}  // Siempre muestra 2 decimales
                maxFractionDigits={2}  // Máximo 2 decimales
                useGrouping={true}  // Activa los separadores de miles
              />            </div>
          </div>
          <div className="flex justify-content-end mt-3">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setShowRecargaDialog(false)}
            />
            <Button
              label="Confirmar"
              icon="pi pi-check"
              className="p-button-success"
              onClick={() => {
                setShowRecargaDialog(false);
              }}
            />
          </div>
        </div>
      </Dialog>
    </div>

  );
};

export default Dashboard;