import React, { useState } from 'react';
import { X, Layers, AlertCircle, Loader2 } from 'lucide-react';

export const RestockModal = ({ isOpen, onClose, vehicle, onRestockSubmit }) => {
  const [amount, setAmount] = useState('5');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Restock amount must be a positive number greater than 0.');
      return;
    }

    setLoading(true);

    try {
      await onRestockSubmit(vehicle._id, numAmount);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to restock vehicle');
    } finally {
      setLoading(false);
    }
  };

  const currentQuantity = vehicle.quantity || 0;
  const projectedQuantity = currentQuantity + (Number(amount) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-md rounded-2xl border border-slate-800 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Restock Vehicle Inventory
            </h2>
            <p className="text-xs text-slate-400">
              {vehicle.make} {vehicle.model} ({vehicle.category})
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
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Current Stock:</span>
              <strong className="text-slate-200">{currentQuantity} units</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Projected Total Stock:</span>
              <strong className="text-emerald-400">{projectedQuantity} units</strong>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
              Add Quantity (Restock Amount) *
            </label>
            <input
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5"
              className="w-full glass-input px-3.5 py-2.5 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
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
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Restocking...
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  Confirm Restock
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
