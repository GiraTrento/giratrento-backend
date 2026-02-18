const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  items: [{
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: Number,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  bookingDate: { type: Date, default: Date.now },
  pickupDate: Date
});

module.exports = mongoose.model('Order', OrderSchema);
