const mongoose = require('mongoose');
const config = require('../../config/config.json');
const activities = [//PLAYING, STREAMING, LISTENING, WATCHING, COMPETING 
    { name: ` ❏ >>help | Ayuda con los comandos`, type: `PLAYING` },
    { name: ` ❏ Bugs o Problemas mios al MD ☘`, type: `WATCHING` },
    { name: ` ❏ no ser peruana ღ`, type: `COMPETING` },
];

module.exports = async (client) => {
    //Nos conectamos a la base de datos
    mongoose.connect(config.mongodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log(`☁ Conectado a la Base de Datos de MONGODB`.blue);
    }).catch((err) => {
        console.log(`🌩 ERROR AL CONECTAR A LA BASE DE DATOS DE MONGODB`.red);
        console.log(err);
    })
    console.log(`Conectado cómo ${client.user.tag}`.green);

    //ESTADO BOT
    setInterval(async() => {
        // generate random number between 1 and list length.
        var randomStatus = activities[Math.floor(Math.random() * activities.length)];
        //online, dnd, idle, invisible
        client.user.setPresence({ activities: [randomStatus], status: `idle` });
    }, 10000);

    //CAMBIO ESTADOS
    

}