import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { MegaMenu } from 'primereact/megamenu';
import { MenuItem } from 'primereact/menuitem';
import '../css/Dashboard.css';

const Dashboard: React.FC = () => {
  const [showRecargaDialog, setShowRecargaDialog] = useState(false);
  const [value1, setValue1] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const buildMenuItems = (selected: string | null): MenuItem[] => {
    const options = ['Tesla', 'Microsoft', 'Apple', 'Netflix'];
    
    return [
      {
        label: selected || 'Furniture',
        icon: 'pi pi-building-columns',
       
        items: [
          {
            items: options.map(option => ({
              icon: selected === option ? 'pi pi-star-fill' : 'pi pi-star',
              label: option,
              className: 'acciones-menu-item',
              command: () => handleSelection(option)
            }))
          }
        ]
      }
    ];
  };

  const [menuItems, setMenuItems] = useState<MenuItem[]>(buildMenuItems(null));

  const handleSelection = (option: string) => {
    const newSelection = option === selectedOption ? null : option;
    setSelectedOption(newSelection);
    setMenuItems(buildMenuItems(newSelection));
  };

  return (
    <div className="dashboard-container">
      <div className="left-panel">
        <div className="card acciones-menu-container">
          <MegaMenu 
            model={menuItems} 
            breakpoint="960px"
            orientation="vertical"
            className="acciones-menu"
          />
        </div>
      </div>
      <div className="right-panel">
        <div className="orden-box">
          <h2>Manejo de ordenes</h2>
          <Button
            severity="success" 
            raised
            icon="pi pi-shopping-cart"
            label='BUY'
            className="order-button"
          />
          <Button
            severity="danger" 
            raised
            icon="pi pi-shop"
            label='SELL'
            className="order-button"
          />
        </div>
        <div className="saldo-box">
          <div>
            <h2>Saldo</h2>
            <span className="detail-value">1</span>
          </div>
          <div>
            <Button
              severity="warning" 
              outlined
              icon="pi pi-wallet"
              label='Recargar'
              onClick={() => setShowRecargaDialog(true)}
              className="recharge-button"
            />
          </div>
        </div>
        <div className="detalles-box">
          <div>
            <h2>Ganancias:</h2>
            <span className="detail-value profit-value">1000</span>
          </div>
          <div>
            <h2>Perdidas: </h2>
            <span className="detail-value loss-value">10000</span>
          </div>
        </div>
      </div>

      <Dialog
        header="Recargar Saldo"
        visible={showRecargaDialog}
        className="recharge-dialog"
        onHide={() => setShowRecargaDialog(false)}
      >
        <div className="dialog-content">
          <h3>Ingrese el monto a recargar:</h3>
          <div className="input-container">
            <InputNumber
              inputId="monto-recarga"
              value={value1}
              onValueChange={(e) => setValue1(e.value || 0)}
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={2}
              useGrouping={true}
              className="amount-input"
            />
          </div>
          <div className="dialog-actions">
            <Button 
              label="Cancelar"
              icon="pi pi-times"
              className="cancel-button"
              onClick={() => setShowRecargaDialog(false)}
            />
            <Button 
              label="Confirmar"
              icon="pi pi-check"
              className="confirm-button"
              onClick={() => {
                // Lógica para recargar saldo aquí
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