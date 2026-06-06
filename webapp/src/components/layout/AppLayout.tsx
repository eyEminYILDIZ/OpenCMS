import { LayoutProvider } from '../../context/LayoutContext';
import Navbar from './navbar/Navbar';
import Sidebar from './sidebar/Sidebar';
import RightPanel from './right-panel/RightPanel';
import StatusBar from './StatusBar';
import { useEffect } from 'react';
import { stores } from "../../stores"
import CenterPanel from './center-panel/CenterPanel';


const AppLayout = () => {
  const { applicationStore } = stores;

  useEffect(() => {
    applicationStore.loadItemCounts();
  }, []);

  return (
    <LayoutProvider>
      <div className="app-layout">
        <header className="app-layout-header">
          <Navbar />
        </header>
        <div className="app-layout-main">
          <aside className="app-layout-sidebar">
            <Sidebar />
          </aside>
          <main className="app-layout-center">
            <div className="center-placeholder">
              <CenterPanel />
            </div>
          </main>
        </div>
        <footer className="app-layout-statusbar">
          <StatusBar />
        </footer>
      </div>
      <RightPanel />
    </LayoutProvider>
  )
};

export default AppLayout;
