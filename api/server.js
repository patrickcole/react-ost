const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
let cors = require('cors');

const Soundtrack = require('./schemas/Soundtrack');

require('custom-env').env(true)

const DB_PATH = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
const app = express();
const router = express.Router();

app.use( cors() );
app.use( bodyParser.urlencoded({ extended: false }));
app.use( bodyParser.json() );
app.use( logger('dev') );
app.use('/api', router);

mongoose.connect( DB_PATH, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('Connected to the database.') );
db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

router.get('/soundtracks', (req, res) => {
  Soundtrack.find( (err, data) => {
    if ( err ) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get('/soundtrack/:id', (req, res) => {
  Soundtrack.findOne({ slug: req.params.id}, (err, data) => {
    if ( err ) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  })
})

app.listen(process.env.APP_PORT, () => console.log(`API Running on port ${process.env.APP_PORT}`) );
