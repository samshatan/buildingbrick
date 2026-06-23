import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  materialId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  image: {
    type: String,
    required: true
  },
  retailer: {
    name: String,
    distance: String,
    stock: String
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  }
}, { timestamps: true });

// Middleware to calculate totalPrice before saving
cartSchema.pre('save', function(next) {
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  next();
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
