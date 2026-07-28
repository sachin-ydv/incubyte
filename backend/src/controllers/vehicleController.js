const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private (Authenticated users)
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search vehicles by make, model, category, price range
// @route   GET /api/vehicles/search
// @access  Private
const searchVehicles = async (req, res) => {
  try {
    const { make, model, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (make) {
      query.make = { $regex: new RegExp(make, 'i') };
    }

    if (model) {
      query.model = { $regex: new RegExp(model, 'i') };
    }

    if (category) {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
    }

    const vehicles = await Vehicle.find(query);
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Private
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new vehicle
// @route   POST /api/vehicles
// @access  Private (Admin only)
const createVehicle = async (req, res) => {
  try {
    const { make, model, category, year, price, quantity } = req.body;

    if (!make || !model || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const vehicle = await Vehicle.create({
      make,
      model,
      category,
      year,
      price,
      quantity,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Admin only)
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedVehicle);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Admin only)
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.deleteOne();
    res.status(200).json({ message: 'Vehicle removed successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Atomically purchase a vehicle (decrement quantity by 1)
// @route   POST /api/vehicles/:id/purchase
// @access  Private (Authenticated users)
const purchaseVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await Vehicle.findById(id);
    if (!exists) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Atomic findOneAndUpdate with $inc and quantity guard query filter
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { _id: id, quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } },
      { new: true, runValidators: true }
    );

    if (!updatedVehicle) {
      return res.status(400).json({ message: 'Vehicle is out of stock' });
    }

    res.status(200).json(updatedVehicle);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Atomically restock a vehicle (increment quantity by amount)
// @route   POST /api/vehicles/:id/restock
// @access  Private (Admin only)
const restockVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const restockAmount = Number(amount);
    if (isNaN(restockAmount) || restockAmount <= 0) {
      return res.status(400).json({ message: 'Restock amount must be a positive number' });
    }

    const exists = await Vehicle.findById(id);
    if (!exists) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Atomic findOneAndUpdate with $inc
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { _id: id },
      { $inc: { quantity: restockAmount } },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedVehicle);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVehicles,
  searchVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
};
