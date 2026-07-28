import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SearchFilterBar } from './SearchFilterBar';
import { VehicleCard } from './VehicleCard';
import { Car, Layers, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export const VehicleDashboard = ({ onEditVehicle, onAddVehicle, onRestockVehicle }) => {
  const { isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilters, setActiveFilters] = useState(null);

  const fetchVehicles = async (filters = null) => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (filters && Object.keys(filters).length > 0) {
        data = await vehicleService.search(filters);
      } else {
        data = await vehicleService.getAll();
      }
      setVehicles(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch vehicle inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSearch = (filters) => {
    setActiveFilters(filters);
    fetchVehicles(filters);
  };

  const handleResetFilters = () => {
    setActiveFilters(null);
    fetchVehicles(null);
  };

  const handlePurchase = async (id) => {
    await vehicleService.purchase(id);
    // Refresh inventory to display updated quantity
    fetchVehicles(activeFilters);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle from inventory?')) {
      try {
        await vehicleService.delete(id);
        fetchVehicles(activeFilters);
      } catch (err) {
        alert(err.message || 'Failed to delete vehicle');
      }
    }
  };

  // Metrics
  const totalVehiclesCount = vehicles.length;
  const totalQuantitySum = vehicles.reduce((sum, v) => sum + (v.quantity || 0), 0);
  const outOfStockCount = vehicles.filter((v) => v.quantity <= 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Vehicle Inventory</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-sky-400 font-semibold border border-slate-700">
              Live Stock
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse, search, and manage dealership vehicles in real-time
          </p>
        </div>

        {/* Quick Admin Add Button (Step 8 prep) */}
        {isAdmin && onAddVehicle && (
          <button
            onClick={onAddVehicle}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            + Add New Vehicle
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Models</span>
            <strong className="text-xl font-bold text-white">{totalVehiclesCount}</strong>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Available Stock</span>
            <strong className="text-xl font-bold text-white">{totalQuantitySum} units</strong>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Out of Stock Alert</span>
            <strong className="text-xl font-bold text-white">{outOfStockCount} models</strong>
          </div>
        </div>
      </div>

      {/* Search Filter Bar */}
      <SearchFilterBar onSearch={handleSearch} onReset={handleResetFilters} />

      {/* Error Notice */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchVehicles(activeFilters)}
            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Inventory Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500 mb-3" />
          <p className="text-sm font-medium">Loading dealership inventory...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 max-w-md mx-auto my-8">
          <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Vehicles Found</h3>
          <p className="text-xs text-slate-400 mb-4">
            No cars match your specified search criteria or inventory is empty.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              onPurchase={handlePurchase}
              onEdit={onEditVehicle}
              onDelete={handleDelete}
              onRestock={onRestockVehicle}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};
