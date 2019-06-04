const mongoose = require('mongoose');

let soundtrackSchema = new mongoose.Schema({
  slug: String,
  title: String,
  embed: String,
  tracks: [
    {
      title: String,
      playAt: Number
    }
  ]
});

module.exports = mongoose.model('Soundtrack', soundtrackSchema);