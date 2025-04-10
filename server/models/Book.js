import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Self-Help', 'Technology', 'Business', 'Literature', 'Academic', 'Other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  },
  images: [{
    type: String
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  publicationYear: {
    type: Number
  },
  publisher: {
    type: String,
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    default: 'English'
  },
  pages: {
    type: Number,
    min: 1
  },
  quantity: {
    type: Number,
    default: 1,
    min: 0
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text', description: 'text' });

const Book = mongoose.model('Book', bookSchema);

export default Book;