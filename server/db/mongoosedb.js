const Mongoose = require('mongoose');
Mongoose.Promise = global.Promise;
Mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoAppNuevo');
module.exports = {Mongoose}