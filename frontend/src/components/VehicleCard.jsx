import React, { useState } from 'react';
import { ShoppingBag, Car, Calendar, Tag, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

export const VehicleCard = ({ vehicle = {}, onPurchase = () => {}, onEdit = () => {}, onDelete = () => {}, onRestock = () => {}, isAdmin = false }) => {
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseMsg, setPurchaseMsg] = useState(null);

  const currentYear = new Date().getFullYear();
  const age = currentYear - (vehicle.year || currentYear);
  const conditionLabel = age <= 1 ? 'New Arrival' : age <= 3 ? 'Low Mileage' : 'Certified Pre-Owned';
  const specialBadge = vehicle.price >= 100000 ? 'Luxury' : vehicle.price >= 60000 ? 'Premium' : vehicle.price >= 35000 ? 'Popular' : 'Everyday';

  const handlePurchaseClick = async () => {
    if ((vehicle.quantity || 0) <= 0 || purchasing) return;
    setPurchasing(true);
    setPurchaseMsg(null);
    try {
      await onPurchase(vehicle._id);
      setPurchaseMsg({ type: 'success', text: 'Vehicle purchased successfully!' });
      setTimeout(() => setPurchaseMsg(null), 3000);
    } catch (err) {
      setPurchaseMsg({ type: 'error', text: err?.message || 'Purchase failed' });
      setTimeout(() => setPurchaseMsg(null), 4000);
    } finally {
      setPurchasing(false);
    }
  };

  const isOutOfStock = (vehicle.quantity || 0) <= 0;

  const shortId = vehicle._id ? String(vehicle._id).slice(-6) : '------';

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-800/80 hover:border-slate-700/80 transition-all shadow-xl shadow-slate-950/10">
      {/* Image header */}
      <div className="relative h-44 bg-slate-900/90 overflow-hidden">
        {vehicle.imageUrl ? (
          <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-4 left-4 rounded-full bg-slate-950/80 border border-slate-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200">
          {vehicle.color || 'Signature'}
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 group-hover:scale-105 transition-transform">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 block">{vehicle.category}</span>
                <h3 className="text-base font-bold text-white tracking-tight">{vehicle.make} {vehicle.model}</h3>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
              isOutOfStock ? 'bg-red-500/10 text-red-400 border-red-500/20' : (vehicle.quantity || 0) <= 2 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity || 0} Available`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-4 py-3 px-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Year: <strong className="text-slate-200">{vehicle.year || 'N/A'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              <span>ID: <strong className="text-slate-200">{shortId}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mb-4">
            <div className="rounded-2xl bg-slate-900/70 p-2">
              <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-500">Fuel</span>
              <strong className="text-slate-200">{vehicle.fuelType || 'Gasoline'}</strong>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-2">
              <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-500">Drive</span>
              <strong className="text-slate-200">{vehicle.drivetrain || 'FWD'}</strong>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-2">
              <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-500">Mileage</span>
              <strong className="text-slate-200">{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} mi` : 'N/A'}</strong>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-2">
              <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-500">Color</span>
              <strong className="text-slate-200">{vehicle.color || 'N/A'}</strong>
            </div>
          </div>

          {vehicle.description && (
            <p className="text-sm text-slate-300 leading-6 mb-4">{vehicle.description}</p>
          )}

          <div className="grid grid-cols-1 gap-2 text-[11px] text-slate-400 mb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/75 px-3 py-1 text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              {conditionLabel}
            </span>
            <span>{vehicle.category} • {specialBadge} tier • {isOutOfStock ? 'Ready for restock' : 'Ready for purchase'}</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-xs text-slate-400 font-medium">Price</span>
            <span className="text-xl font-extrabold text-white tracking-tight">${(vehicle.price || 0).toLocaleString()}</span>
          </div>

          {purchaseMsg && (
            <div className={`mb-3 p-2 rounded-lg text-xs flex items-center gap-1.5 ${purchaseMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {purchaseMsg.type === 'success' ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
              <span>{purchaseMsg.text}</span>
            </div>
          )}

          <button type="button" disabled={isOutOfStock || purchasing} onClick={handlePurchaseClick} className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${isOutOfStock ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50' : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/20'}`}>
            {purchasing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processing Purchase...
              </>
            ) : isOutOfStock ? (
              <>
                <AlertTriangle className="w-4 h-4" /> Out of Stock
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Purchase Vehicle
              </>
            )}
          </button>

          {isAdmin && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <button onClick={() => onRestock(vehicle)} className="text-emerald-400 hover:text-emerald-300 font-semibold text-[11px] flex items-center gap-1">+ Restock</button>
              <div className="flex gap-2">
                <button onClick={() => onEdit(vehicle)} className="text-sky-400 hover:text-sky-300 font-medium text-[11px]">Edit</button>
                <button onClick={() => onDelete(vehicle._id)} className="text-red-400 hover:text-red-300 font-medium text-[11px]">Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
