import React, { useRef, useState, ReactElement } from 'react';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { useNavigate } from 'react-router-dom';
import Logo from '../images/Logo.png';
import '../css/Home.css';

// Componentes de vista (archivos separados)
import ProfileView from '../views/ProfileView';
import Dashboard from '../views/Dashboard';
// import NewView from './views/NewView';
// import SearchView from './views/SearchView';
// import SettingsView from './views/SettingsView';
// import MessagesView from './views/MessagesView';
// import LogoutView from './views/LogoutView';

interface CustomMenuItem extends MenuItem {
  badge?: number;
  className?: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const menuRef = useRef<Menu>(null);
  const [activeView, setActiveView] = useState<ReactElement>(<ProfileView />);

  const handleViewChange = (viewComponent: ReactElement) => {
    setActiveView(viewComponent);
  };

  const itemRenderer = (item: CustomMenuItem) => (
    <div className="menuitem-content">
      <a 
        className="menuitem-link" 
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          item.command?.({ originalEvent: e, item });
        }}
      >
        <span className={`menuitem-icon ${item.icon}`} />
        <span className="menuitem-label">{item.label}</span>
        {item.badge !== undefined && (
          <span className="menuitem-badge">{item.badge}</span>
        )}
      </a>
    </div>
  );

  const menuItems: CustomMenuItem[] = [
    { 
      label: 'Dashboard', 
      icon: 'pi pi-chart-line', 
      template: itemRenderer,
      command: () => handleViewChange(<Dashboard />)
    },
    { 
      label: 'Portafolio', 
      icon: 'pi pi-briefcase', 
      template: itemRenderer,
      // command: () => handleViewChange(<SettingsView />)
    },
    { 
      label: 'Messages', 
      icon: 'pi pi-inbox', 
      badge: 2, 
      template: itemRenderer,
      className: 'menuitem-messages',
      // command: () => handleViewChange(<MessagesView />)
    },
    {
      label: 'Info',
      icon: 'pi pi-user',
      template: itemRenderer,
      command: () => handleViewChange(<ProfileView />)
    },
    { 
      label: 'Logout', 
      icon: 'pi pi-sign-out', 
      template: itemRenderer,
      className: 'menuitem-logout',
      command: () => navigate('/')
    }
    
  ];

  return (
    <div>
      <header className="home-header">
        <div className="header-home logo-containerhome">
            <img src={Logo} alt="Acciones ElBosque" className="logo-dsh" />
        </div>
      </header>
      <div className="main-content">
        <div className="sidebar-menu-container">
          <Menu 
            ref={menuRef}
            model={menuItems} 
            className="app-sidebar-menu"
            popup={false}
          />
        </div>
        <div className="main-view-content">
          {activeView}
        </div>
      </div>
    </div>
  );
};

export default Home;