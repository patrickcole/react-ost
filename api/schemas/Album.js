const mongoose = require('mongoose');

let albumSchema = new mongoose.Schema({ 
  slug: String,
  title: String
 });

module.exports = mongoose.model('Album', albumSchema);