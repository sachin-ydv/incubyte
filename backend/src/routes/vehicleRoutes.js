const express = require('express');
const router = express.Router();
const {
  getVehicles,
  searchVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} = require('../controllers/vehicleController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/search', searchVehicles);

router.route('/')
  .get(getVehicles)
  .post(adminOnly, createVehicle);

router.post('/:id/purchase', purchaseVehicle);
router.post('/:id/restock', adminOnly, restockVehicle);

router.route('/:id')
  .get(getVehicleById)
  .put(adminOnly, updateVehicle)
  .delete(adminOnly, deleteVehicle);

module.exports = router;
