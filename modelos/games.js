const mongoose = require('mongoose');
const gamesSchema = new mongoose.Schema({
    guildID: String,
    canalID: {type: String, default: ""},
    canalNsfw: {type: String, default: ""},
    activado: {type: Boolean, default: false},
    juegos: {type: Array, default: []}
})

const model = mongoose.model("Game",gamesSchema);

module.exports = model;