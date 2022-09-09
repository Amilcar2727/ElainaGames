const Discord = require('discord.js');
const config = require('./config/config.json');
const fs = require('fs');

require('colors');

const client = new Discord.Client({ //permisos
    
    restTimeOffset: 0,
    partials: ['MESSAGE','CHANNEL','REACTION','GUILD_MEMBER','USER'],
    
    intents:[
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.GUILD_PRESENCES
    ],
})

client.commands = new Discord.Collection();
client.aliases= new Discord.Collection();

client.color = config.color;

client.login(config.token) //logeo

/* SISTEMA DE IDIOMAS */
client.la = {};
let idiomas = fs.readdirSync('./idiomas').filter(archivo => archivo.endsWith(".json")).map(idioma => idioma.replace(/.json/, ""));
console.log(idiomas)
for(const idioma of idiomas){
    client.la[idioma] = require(`./idiomas/${idioma}`)
}
Object.freeze(client.la)

/*SISTEMA DE MDS*/

//Handler:
function requerirHandlers(){
    ["command","events","distube","reaccion_roles","tickets","sugerencias","sorteos","niveles","bienvenidas","autoMod","juegos"].forEach(handler =>{
        try{
            require(`./handlers/${handler}`)(client, Discord);
        }catch(e){
            console.warn(e);
        }
    })
}
requerirHandlers();
//.then(msg => setTimeout(() => {msg.delete();}, 30000)).catch(()=>{});
