const mongoose = require('mongoose');

const taxIdSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
    minLength: 13,
    maxLength: 13
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TaxId', taxIdSchema);