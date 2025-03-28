const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled'
  },
  nodes: [{
    id: String,
    text: String
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

processSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Process', processSchema);
