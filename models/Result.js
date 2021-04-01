var mongoose = require('mongoose');

var ResultSchema = new mongoose.Schema({
  testdata: Array,
  age: Number,
  language: String,
  sex: String,
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Result', ResultSchema);
