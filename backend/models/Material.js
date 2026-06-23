import mongoose from 'mongoose';

const retailerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: String,
    required: true,
    enum: ['In Stock', 'Low Stock', 'Out of Stock']
  },
  distance: {
    type: String,
    required: true
  }
});

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  retailers: [retailerSchema]
}, { timestamps: true });

const Material = mongoose.model('Material', materialSchema);
export default Material;
