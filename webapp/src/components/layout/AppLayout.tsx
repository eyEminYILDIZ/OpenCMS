import { LayoutProvider } from '../../context/LayoutContext';
import Navbar from './navbar/Navbar';
import Sidebar from './sidebar/Sidebar';
import RightPanel from './right-panel/RightPanel';
import StatusBar from './StatusBar';

const AppLayout = () => (
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
          <div className="center-placeholder">Map area — coming soon</div>
        </main>
      </div>
      <footer className="app-layout-statusbar">
        <StatusBar />
      </footer>
    </div>
    <RightPanel />
  </LayoutProvider>
);

export default AppLayout;
