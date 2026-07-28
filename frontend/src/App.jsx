import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthPage } from './pages/AuthPage';
import { VehicleDashboard } from './components/VehicleDashboard';
import { AdminVehicleModal } from './components/AdminVehicleModal';
import { RestockModal } from './components/RestockModal';
import { vehicleService } from './services/api';
import { Loader2 } from 'lucide-react';

export function AppContent() {
  const { user, loading } = useAuth();

  // Admin Modal States
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockVehicleTarget, setRestockVehicleTarget] = useState(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerDashboardRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleOpenAddModal = () => {
    setSelectedVehicle(null);
    setIsAdminModalOpen(true);
  };

  const handleOpenEditModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsAdminModalOpen(true);
  };

  const handleOpenRestockModal = (vehicle) => {
    setRestockVehicleTarget(vehicle);
    setIsRestockModalOpen(true);
  };

  const handleSaveVehicle = async (vehicleData, id) => {
    if (id) {
      await vehicleService.update(id, vehicleData);
    } else {
      await vehicleService.create(vehicleData);
    }
    triggerDashboardRefresh();
  };

  const handleRestockSubmit = async (id, amount) => {
    await vehicleService.restock(id, amount);
    triggerDashboardRefresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
          <span>Loading AutoVault...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <VehicleDashboard
          key={refreshTrigger}
          onAddVehicle={handleOpenAddModal}
          onEditVehicle={handleOpenEditModal}
          onRestockVehicle={handleOpenRestockModal}
        />
      </main>

      {/* Admin Modals */}
      <AdminVehicleModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        vehicle={selectedVehicle}
        onSave={handleSaveVehicle}
      />

      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        vehicle={restockVehicleTarget}
        onRestockSubmit={handleRestockSubmit}
      />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
