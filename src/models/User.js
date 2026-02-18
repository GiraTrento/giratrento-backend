const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'merchant'], default: 'user' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
  userCode: { type: String, default: () => Math.random().toString(36).substr(2, 9).toUpperCase() }, 
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', UserSchema);
