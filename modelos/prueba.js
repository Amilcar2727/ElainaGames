const mongoose = require('mongoose');
const prueba = new mongoose.Schema({
    userID: {type: String, require: true},
    array: {type: Array, default: []},
})

const model = mongoose.model("Prueba",prueba);

module.exports = model;