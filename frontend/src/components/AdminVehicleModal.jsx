import React, { useState, useEffect } from 'react';
import { X, Car, Plus, Save, AlertCircle, Loader2 } from 'lucide-react';

export const AdminVehicleModal = ({ isOpen, onClose, vehicle, onSave }) => {
  const isEdit = Boolean(vehicle?._id);

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('Sedan');
  const [year, setYear] = useState(new Date().getFullYear());
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setMake(vehicle.make || '');
      setModel(vehicle.model || '');
      setCategory(vehicle.category || 'Sedan');
      setYear(vehicle.year || new Date().getFullYear());
      setPrice(vehicle.price !== undefined ? vehicle.price : '');
      setQuantity(vehicle.quantity !== undefined ? vehicle.quantity : '');
    } else {
      setMake('');
      setModel('');
      setCategory('Sedan');
      setYear(new Date().getFullYear());
      setPrice('');
      setQuantity('1');
    }
    setError('');
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!make.trim() || !model.trim() || !category || price === '' || quantity === '') {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    const vehicleData = {
      make: make.trim(),
      model: model.trim(),
      category,
      year: Number(year),
      price: Number(price),
      quantity: Number(quantity),
    };

    try {
      await onSave(vehicleData, vehicle?._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-lg rounded-2xl border border-slate-800 p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {isEdit ? 'Edit Vehicle Details' : 'Add New Inventory Vehicle'}
            </h2>
            <p className="text-xs text-slate-400">
              {isEdit ? 'Update existing specifications & pricing' : 'Register a new model to inventory'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                Make *
              </label>
              <input
                type="text"
                required
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g. Toyota"
                className="w-full glass-input px-3.5 py-2 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                Model *
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Camry"
                className="w-full glass-input px-3.5 py-2 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-lg text-xs text-slate-100 focus:outline-none bg-slate-900"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Coupe">Coupe</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                Year
              </label>
              <input
                type="number"
                min="1900"
                max="2030"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
                className="w-full glass-input px-3.5 py-2 rounded-lg text-xs text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25000"
                className="w-full glass-input px-3.5 py-2 rounded-lg text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                Initial Quantity *
              </label>
              <input
                type="number"
                min="0"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="5"
                className="w-full glass-input px-3.5 py-2 rounded-lg text-xs text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                <>
                  <Save className="w-4 h-4" />
                  Update Vehicle
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add to Inventory
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
