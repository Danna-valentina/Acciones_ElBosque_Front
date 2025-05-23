import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { UsuarioService } from '../service/UsuarioService';
import { MegaMenu } from 'primereact/megamenu';
import { MenuItem } from 'primereact/menuitem';
import { Chart } from 'primereact/chart';
import { InputText } from 'primereact/inputtext';



import '../css/Dashboard.css';

type MarketData = {
  symbol: string;
  time?: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  price?: number;
  size?: number;
  timestamp?: string;
};

const Dashboard: React.FC = () => {

  const [showRecargaDialog, setShowRecargaDialog] = useState(false);

  const [showRebuyDialog, setShowbuyDialog] = useState(false);
  const [showResellDialog, setShowsellDialog] = useState(false);

  const [stockSymbol, setStockSymbol] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);

  const [value1, setValue1] = useState<number>(0); // Tipo number, no string
  const [moneda, setMoneda] = useState<string>('USD'); // valor por defecto
  const usuarioService = new UsuarioService();
  const [fieldErrors, setFieldErrors] = useState<{ monto: boolean }>({ monto: false });
  const [errorMonto, setErrorMonto] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [precioActual, setPrecioActual] = useState<number | null>(null);
  const [symbolActual, setSymbolActual] = useState<string>('');
  const [marketDataList, setMarketDataList] = useState<MarketData[]>([]);
  const [dataPoints, setDataPoints] = useState<{ time: string, close: number }[]>([]);


  const conectarWebSocket = (symbol: string) => {
    // Cerrar socket anterior si existe
    if (socketRef.current) {
      socketRef.current.close();
    }

    const socket = new WebSocket(`ws://localhost:9090/ws`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('🔌 WebSocket conectado');
    };

    socket.onmessage = (event) => {
      console.log("Mensaje raw recibido:", event.data);
      try {
        const data: MarketData = JSON.parse(event.data);
        console.log("Mensaje parseado:", data); // Log parseado
        if (data.close && (data.symbol === symbolActual || data.symbol === "FAKE")) {
          setPrecioActual(data.close);
          setDataPoints(prev => {
            const newPoints = [...prev, { time: data.time!, close: data.close! }];
            return newPoints.slice(-100);
          });
        }



        // Guardar el mensaje completo en la lista, máximo 20
        setMarketDataList(prev => [data, ...prev].slice(0, 20));
      } catch (err) {
        console.error("❌ Error al parsear JSON:", err);
      }
    };

    socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket cerrado');
    };
  };
  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      usuarioService.obtenerMonedaBase(email)
        .then(moneda => {
          setMoneda(moneda); // esto actualiza el símbolo que se usará
        })
        .catch(err => {
          console.error("No se pudo obtener la moneda:", err);
        });
    }
  }, []);

  const esMontoValido = (): boolean => {
    switch (moneda) {
      case 'USD':
      case 'EUR':
        return value1 >= 0.5;
      case 'COP':
        return value1 >= 2000;
      default:
        return false;
    }
  };


  const buildMenuItems = (selected: string | null): MenuItem[] => {
    // Organización en 4 columnas como en tu código
    const columnGroups = [
      ['Apple', 'Microsoft', 'Intel', 'Cisco', 'Amazon'],
      ['Meta', 'Netflix', 'Palantir Technologies', 'VISA', 'Citigroup Inc'],
      ['GameStop', 'VIX', 'Boeing Company', 'FedEx', 'Tesla'],
      ["McDonald's", 'Pfizer Inc', 'Johnson & Johnson', 'Alibaba']
    ];

    return [
      {
        label: selected || 'Acciones',
        icon: 'pi pi-building-columns',
        className: 'acciones-menu-header',
        items: columnGroups.map((column, index) => ({
          className: `menu-column-${index}`,
          items: column.map(option => ({
            icon: selected === option ? 'pi pi-star-fill' : 'pi pi-star',
            label: option,
            className: 'acciones-menu-item',
            command: () => handleSelection(option)
          }))
        }))
      }
    ];
  };

  const [menuItems, setMenuItems] = useState<MenuItem[]>(buildMenuItems(null));

  const handleSelection = (option: string) => {
    const newSelection = option === selectedOption ? null : option;
    setSelectedOption(newSelection);
    setMenuItems(buildMenuItems(newSelection));
    if (newSelection) {
      setSymbolActual(newSelection); // símbolo activo
      conectarWebSocket(newSelection); // conexión socket
    } else {
      setPrecioActual(null);
      setSymbolActual('');
      if (socketRef.current) {
        socketRef.current.close(); // cerrar conexión si deseleccionas
      }
    }
  };

  const chartData = {
    labels: dataPoints.map(point => new Date(point.time).toLocaleTimeString()),
    datasets: [
      {
        label: `Precio ${symbolActual}`,
        data: dataPoints.map(point => point.close),
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 200
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10,
          autoSkip: true
        }
      },
      y: {
        beginAtZero: false
      }
    }
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

        {symbolActual && (
          <div className="card chart-box">
            <Chart type="line" data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
      <div className="right-panel">
        <div className="price-box">
          {symbolActual && (
            <div className="live-price-box">
              <h3>Precio en tiempo real: <span className="live-price">{precioActual !== null ? `$${precioActual.toFixed(2)}` : 'Cargando...'}</span></h3>
            </div>
          )}
        </div>
        <div className="orden-box">
          <h2>Manejo de ordenes</h2>
          <Button
            severity="success" raised
            icon="pi pi-shopping-cart"
            label='BUY'
            className="order-button"
            onClick={() => setShowbuyDialog(true)}
          />
          <Button
            severity="danger" raised
            icon="pi pi-shop"
            label='SELL'
            className="order-button"
            onClick={() => setShowsellDialog(true)}

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
              className="recharge-button"

            />
          </div>
        </div>
        <div className="detalles-box">
          <div >
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
              showButtons={false}
              mode="currency"
              currency={moneda}
              locale="es-CO"
              minFractionDigits={2}
              maxFractionDigits={2}
              useGrouping={true}
              className="amount-input"
            />

            {fieldErrors.monto && (
              <small className="p-error">{errorMonto}</small>
            )}
          </div>
          <div className="dialog-actions flex justify-content-end gap-2">
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
              onClick={async () => {
                if (!esMontoValido()) {
                  setFieldErrors({ monto: true });
                  setErrorMonto(`El monto mínimo para ${moneda} es ${moneda === 'COP' ? '$2.000' : '$0.50'}`);
                  return;
                }

                setFieldErrors({ monto: false });
                setErrorMonto('');
                setShowRecargaDialog(false);
                try {
                  const email = localStorage.getItem("email");
                  if (!email) {
                    console.error("No se encontró el email del usuario.");
                    return;
                  }

                  const url = await usuarioService.recargarFondos(email, value1);
                  window.location.href = url; // redirige a Stripe
                } catch (error) {
                  console.error("Error al crear sesión de pago:", error);
                  // Aquí puedes mostrar un mensaje al usuario si quieres
                }
              }}
            />

          </div>
        </div>
      </Dialog>

      <Dialog
        header="Compra de acciones"
        visible={showRebuyDialog}
        className="recharge-dialog"
        onHide={() => setShowbuyDialog(false)}
      >
        <div className="dialog-content">
          <h3>Ingrese los detalles de la compra:</h3>

          {/* Input para el símbolo de la acción */}
          <div className="input-container" style={{ marginBottom: '1rem' }}>
            <label htmlFor="symbol-accion" className="block mb-2">Símbolo de la acción:</label>
            <InputText
              id="symbol-accion"
              value={stockSymbol}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStockSymbol(e.target.value)}
              className="w-full"
              placeholder="Ej: AAPL, MSFT"
            />
          </div>

          {/* Input mejorado para la cantidad de acciones */}
          <div className="input-container mb-4">
            <label htmlFor="cantidad-acciones" className="block mb-2">Cantidad de acciones:</label>
            <InputNumber
              id="cantidad-acciones"
              value={quantity}
              onValueChange={(e) => setQuantity(e.value || 0)}
              min={1}
              max={10000}
              mode="decimal"
              minFractionDigits={0}
              maxFractionDigits={0}
              useGrouping={false}
              className="w-full"
              placeholder="Ingrese cantidad"
            />
            <small className="text-gray-500 block mt-1">Mínimo: 1 acción</small>
          </div>

          <div className="dialog-actions flex justify-content-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setShowbuyDialog(false)}
            />
            <Button
              label="Confirmar"
              icon="pi pi-check"
              className="p-button-success"
              onClick={async () => {

              }}>
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        header="Venta de acciones"
        visible={showResellDialog}
        className="recharge-dialog"
        onHide={() => setShowsellDialog(false)}
      >
        <div className="dialog-content">
          <h3>Ingrese los detalles de la venta:</h3>

          {/* Input para el símbolo de la acción */}
          <div className="input-container" style={{ marginBottom: '1rem' }}>
            <label htmlFor="symbol-accion" className="block mb-2">Símbolo de la acción:</label>
            <InputText
              id="symbol-accion"
              value={stockSymbol}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStockSymbol(e.target.value)}
              className="w-full"
              placeholder="Ej: AAPL, MSFT"
            />
          </div>

          {/* Input mejorado para la cantidad de acciones */}
          <div className="input-container mb-4">
            <label htmlFor="cantidad-acciones" className="block mb-2">Cantidad de acciones:</label>
            <InputNumber
              id="cantidad-acciones"
              value={quantity}
              onValueChange={(e) => setQuantity(e.value || 0)}
              min={1}
              max={10000}
              mode="decimal"
              minFractionDigits={0}
              maxFractionDigits={0}
              useGrouping={false}
              className="w-full"
              placeholder="Ingrese cantidad"
            />
            <small className="text-gray-500 block mt-1">Mínimo: 1 acción</small>
          </div>

          <div className="dialog-actions flex justify-content-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setShowsellDialog(false)}
            />
            <Button
              label="Confirmar"
              icon="pi pi-check"
              className="p-button-success"
              onClick={async () => {

              }}>
            </Button>
          </div>
        </div>
      </Dialog>
    </div>

  );
};

export default Dashboard;