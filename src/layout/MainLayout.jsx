import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Drawer from '../components/Drawer';
import EcoBar from '../components/EcoBar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Navbar onOpenDrawer={() => setDrawerOpen(true)} />
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      <div className="page">
        <Outlet />
        <EcoBar />
      </div>

      <Footer />
    </>
  );
}
