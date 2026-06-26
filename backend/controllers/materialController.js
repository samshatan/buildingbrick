import Material from '../models/Material.js';

// @desc    Get all materials
// @route   GET /api/v1/materials
// @access  Public
export const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find({});
    res.status(200).json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single material
// @route   GET /api/v1/materials/:id
// @access  Public
export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Seed materials (TEMPORARY for development)
// @route   POST /api/v1/materials/seed
// @access  Public
export const seedMaterials = async (req, res) => {
  try {
    const mockData = [
      {
        name: "Classic Red Brick (Pallet)",
        category: "Bricks",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=300&q=80",
        description: "Standard red clay bricks for general masonry. 500 count per pallet.",
        retailers: [
          { name: "HomeDepot", price: 355, stock: "Low Stock", distance: "2.1 mi" },
          { name: "BuildMart", price: 340, stock: "In Stock", distance: "4.5 mi" },
          { name: "Masonry Supply Co.", price: 325, stock: "In Stock", distance: "8.0 mi" }
        ]
      },
      {
        name: "Portland Cement (50lb)",
        category: "Cement",
        image: "https://images.unsplash.com/photo-1621644782250-bcce4cc87c32?auto=format&fit=crop&w=300&q=80",
        description: "High quality portland cement for structural concrete.",
        retailers: [
          { name: "BuildMart", price: 18.50, stock: "In Stock", distance: "4.5 mi" },
          { name: "City Hardware", price: 21.00, stock: "In Stock", distance: "1.2 mi" },
          { name: "HomeDepot", price: 17.90, stock: "Out of Stock", distance: "2.1 mi" }
        ]
      },
      {
        name: "Washed Concrete Sand (Ton)",
        category: "Sand",
        image: "https://images.unsplash.com/photo-1541604193435-22287d32c2c2?auto=format&fit=crop&w=300&q=80",
        description: "Clean washed sand for mixing and leveling.",
        retailers: [
          { name: "City Hardware", price: 45, stock: "In Stock", distance: "1.2 mi" },
          { name: "Masonry Supply Co.", price: 40, stock: "In Stock", distance: "8.0 mi" }
        ]
      }
    ];

    await Material.deleteMany({});
    const createdMaterials = await Material.insertMany(mockData);

    res.status(201).json({ success: true, count: createdMaterials.length, data: createdMaterials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
