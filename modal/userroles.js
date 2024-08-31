const mongoose = require('mongoose');

const GeneralMasterSchema = new mongoose.Schema({
  id: String,
  type: String,
  value: String,
});

module.exports = mongoose.model('GeneralMaster', GeneralMasterSchema);
