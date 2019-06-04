const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
let cors = require('cors');

const Album = require('./schemas/Album');
const Soundtrack = require('./schemas/Soundtrack');

if ( (process.env.NODE_ENV || 'development') === 'development' ){
  const dotenv = require('dotenv')
  dotenv.config();
  console.log(`Server is reporting in development mode`);
}

const DB_PATH = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
const app = express();
const router = express.Router();

app.use( cors() );
app.use( bodyParser.urlencoded({ extended: false }));
app.use( bodyParser.json() );
app.use( logger('dev') );
app.use('/api', router);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/404.html'));
});
*/

mongoose.connect( DB_PATH, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('Connected to the database.') );
db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

router.get('/albums', (req, res) => {
  Album.find( ( err, data ) => {
    if ( err ) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  })
});

router.get('/soundtracks', (req, res) => {
  Soundtrack.find( (err, data) => {
    if ( err ) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get('/soundtrack/:id', (req, res) => {
  Soundtrack.findOne({ slug: req.params.id}, (err, data) => {
    if ( err ) return res.json({ success: false, error: err });
    if ( !data ) return res.json( { success: true, data: { title: 'Soundtrack Not Found' } } );
    return res.json({ success: true, data: data });
  })
})



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API Running on port ${port}`) );
