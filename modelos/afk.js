const mongoose = require('mongoose');
const afkSchema = new mongoose.Schema({
    Guild: String,
    User: String,
    Razon: {type: String, default: 'Sin Razon'},
    Date: String
})

const model = mongoose.model("AFK's",afkSchema);

module.exports = model;