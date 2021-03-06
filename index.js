var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//config and routing
var config = require('./server/config.js');
var newsRouter = require('./server/routers/getnews.js');
var userPrefsRouter = require('./server/routers/getUserPrefs.js')
//server instance
var server = express();
//middleware
server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlenco
//routes middleware point to ./server/routers/...
server.use('/api/getnews', newsRouter);
server.use('/api/getUserPrefs', userPrefsRouter);
//static file service
server.use(express.static(__dirname + '/client'));
//connections
server.set('port', (process.env.PORT || 5000) );
var env = process.env.NODE_ENV;
var mongoURI = env === 'TEST' ? config.MONGODB_LOCAL_URI : config.MONGODB_STAGING_URI;
console.log('MongoURI: ', mongoURI);
mongoose.connect(mongoURI);
server.listen(server.get('port'), function () {
  console.log('listening');
});

module.exports = server;
