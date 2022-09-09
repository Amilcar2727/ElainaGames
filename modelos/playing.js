const mongoose = require('mongoose');
const playingSchema = new mongoose.Schema({
    playerID: {type: String, default: "", unique: true},
    juegoID: {type: String, default: ""},
    juegoName: {type: String, default: ""},
    mensaje: {type: String, default: ""}
})

const model = mongoose.model("Player", playingSchema);

module.exports = model;