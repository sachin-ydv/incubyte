const Vehicle = require('../models/Vehicle');

const seedVehicles = async () => {
  const count = await Vehicle.countDocuments();
  if (count > 0) return;

  const vehicles = [
    {
      make: 'Toyota',
      model: 'Camry Hybrid',
      category: 'Sedan',
      year: 2024,
      price: 27999,
      quantity: 12,
      imageUrl:
        'https://images.unsplash.com/photo-1525609004556-1b2b07fdb1f5?auto=format&fit=crop&w=1200&q=80',
      color: 'Pearl White',
      fuelType: 'Hybrid',
      drivetrain: 'FWD',
      mileage: 6200,
      description: 'Efficient hybrid sedan with premium comfort and modern driver assistance features.',
    },
    {
      make: 'BMW',
      model: 'X5 xDrive40i',
      category: 'SUV',
      year: 2025,
      price: 64999,
      quantity: 5,
      imageUrl:
        'https://images.unsplash.com/photo-1549921296-3e39b8f73a05?auto=format&fit=crop&w=1200&q=80',
      color: 'Sapphire Black',
      fuelType: 'Gasoline',
      drivetrain: 'AWD',
      mileage: 3200,
      description: 'Luxury SUV with spacious cabin, advanced infotainment, and agile all-wheel performance.',
    },
    {
      make: 'Ford',
      model: 'F-150 Raptor',
      category: 'Truck',
      year: 2024,
      price: 78999,
      quantity: 3,
      imageUrl:
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
      color: 'Velocity Blue',
      fuelType: 'Gasoline',
      drivetrain: '4WD',
      mileage: 4500,
      description: 'High-performance off-road truck designed for rugged terrain with premium cabin amenities.',
    },
    {
      make: 'Tesla',
      model: 'Model 3 Performance',
      category: 'Sedan',
      year: 2025,
      price: 57999,
      quantity: 7,
      imageUrl:
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      color: 'Midnight Silver',
      fuelType: 'Electric',
      drivetrain: 'AWD',
      mileage: 1800,
      description: 'High-performance electric sedan with instant acceleration and intelligent Autopilot support.',
    },
    {
      make: 'Jeep',
      model: 'Wrangler Rubicon',
      category: 'SUV',
      year: 2024,
      price: 59999,
      quantity: 4,
      imageUrl:
        'https://images.unsplash.com/photo-1511918984145-48de785d4c4b?auto=format&fit=crop&w=1200&q=80',
      color: 'Granite Crystal',
      fuelType: 'Gasoline',
      drivetrain: '4WD',
      mileage: 7200,
      description: 'Purpose-built off-road SUV with rugged capability and modern safety technology.',
    },
    {
      make: 'Porsche',
      model: '911 Carrera S',
      category: 'Coupe',
      year: 2023,
      price: 155000,
      quantity: 1,
      imageUrl:
        'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
      color: 'Racing Yellow',
      fuelType: 'Gasoline',
      drivetrain: 'RWD',
      mileage: 2400,
      description: 'High-performance sports coupe with timeless design and track-ready handling.',
    },
    {
      make: 'Volkswagen',
      model: 'Golf GTI',
      category: 'Hatchback',
      year: 2024,
      price: 33999,
      quantity: 6,
      imageUrl:
        'https://images.unsplash.com/photo-1511919103444-8cadb56ec896?auto=format&fit=crop&w=1200&q=80',
      color: 'Pure Red',
      fuelType: 'Gasoline',
      drivetrain: 'FWD',
      mileage: 5300,
      description: 'Sporty hatchback with agile handling, refined interior, and efficient driving dynamics.',
    },
    {
      make: 'Chevrolet',
      model: 'Corvette Stingray',
      category: 'Convertible',
      year: 2024,
      price: 71999,
      quantity: 2,
      imageUrl:
        'https://images.unsplash.com/photo-1511166379479-8c1f9bf61a16?auto=format&fit=crop&w=1200&q=80',
      color: 'Torch Red',
      fuelType: 'Gasoline',
      drivetrain: 'RWD',
      mileage: 1300,
      description: 'Signature convertible sports car with thrilling acceleration and premium craftsmanship.',
    },
    {
      make: 'Honda',
      model: 'Civic Si',
      category: 'Sedan',
      year: 2024,
      price: 28999,
      quantity: 11,
      imageUrl:
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
      color: 'Crystal Black',
      fuelType: 'Gasoline',
      drivetrain: 'FWD',
      mileage: 4900,
      description: 'Sport-focused compact sedan with sharp handling and a driver-oriented cockpit.',
    },
    {
      make: 'Audi',
      model: 'Q7 Premium',
      category: 'SUV',
      year: 2025,
      price: 74999,
      quantity: 4,
      imageUrl:
        'https://images.unsplash.com/photo-1549921296-3e39b8f73a05?auto=format&fit=crop&w=1200&q=80',
      color: 'Glacier White',
      fuelType: 'Gasoline',
      drivetrain: 'AWD',
      mileage: 2100,
      description: 'Executive SUV with luxurious interior, strong powertrain, and advanced driver assistance.',
    },
  ];

  await Vehicle.create(vehicles);
  console.log(`Seeded ${vehicles.length} initial vehicles into inventory.`);
};

module.exports = seedVehicles;
