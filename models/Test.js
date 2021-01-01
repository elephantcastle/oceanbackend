var mongoose = require('mongoose');

var TestSchema = new mongoose.Schema({
  traits: Object,
  groupedFacets: Object,
  age: Number,
  language: String,
  sex: String,
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Test', TestSchema);
