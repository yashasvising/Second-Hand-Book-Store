import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

cartSchema.methods.calculateTotalPrice = async function () {
  await this.populate({
    path: 'items.book',
    select: 'price'
  });

  return this.items.reduce((total, item) => {
    return total + (item.book.price * item.quantity);
  }, 0);
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;