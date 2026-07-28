import React, { useState } from 'react';
import { Search, RotateCcw, Filter, DollarSign } from 'lucide-react';

export const SearchFilterBar = ({ onSearch, onReset }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (make.trim()) params.make = make.trim();
    if (model.trim()) params.model = model.trim();
    if (category) params.category = category;
    if (minPrice !== '') params.minPrice = minPrice;
    if (maxPrice !== '') params.maxPrice = maxPrice;

    onSearch(params);
  };

  const handleReset = () => {
    setMake('');
    setModel('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    onReset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 mb-8"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Filter className="w-4 h-4 text-sky-400" />
        <span>Search & Inventory Filters</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Make input */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Make / Brand</label>
          <input
            type="text"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="e.g. Toyota, BMW"
            className="w-full glass-input px-3 py-2 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Model input */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Model Name</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. Camry, X5"
            className="w-full glass-input px-3 py-2 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Category select */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Body Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full glass-input px-3 py-2 rounded-lg text-xs text-slate-100 focus:outline-none bg-slate-900"
          >
            <option value="">All Categories</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Coupe">Coupe</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Convertible">Convertible</option>
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Min Price ($)</label>
          <div className="relative">
            <DollarSign className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full glass-input pl-7 pr-3 py-2 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Max Price ($)</label>
          <div className="relative">
            <DollarSign className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="100000"
              className="w-full glass-input pl-7 pr-3 py-2 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-semibold shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          Search Inventory
        </button>
      </div>
    </form>
  );
};
