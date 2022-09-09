const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const duration = require('humanize-duration');
const Discord = require('discord.js');

module.exports = {
    name: "work",
    aliases: ["w", "trabajar"],
    desc: "Sirve para trabajar y conseguir monedas cada 3h ",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES"],
    run: async(client,message,args,prefix,idioma) =>{
        var trabajos = client.la[idioma]["comandos"]["economia"]["work"]["trabajos"];
        //aseguramos la economia del usuario
        await asegurar_todo(null,message.author.id);
        //leemos la economia del usuario
        let data = await ecoSchema.findOne({userID: message.author.id});
        //definimos cada cuanto tiempo se puede ejecutar el comando en MS
        let tiempo_ms = 3*60*60*1000 //10800000 ms
        //definimos la recompensa aleatoria de dinero
        let recompensa = Math.floor(Math.random()*800)+200; //800 max y 200 min
        //definimos el trabajo del usuario
        let trabajo = trabajos[Math.floor(Math.random()*trabajos.length)];
        //comprobaciones previas
        if(tiempo_ms - (Date.now()-data.work)>0){
            let tiempo_restante = duration(Date.now()-data.work- tiempo_ms,{
                language: "es",
                units: ["h","m","s"],
                round: true,
            })
            return message.reply({embeds: [new Discord.MessageEmbed()
                .setAuthor({name: `${message.author.tag}`,iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setDescription(eval(client.la[idioma]["comandos"]["economia"]["work"]["variable1"]))
                .setColor("RANDOM")
                .setTimestamp()
            ]})
        }
        await ecoSchema.findOneAndUpdate({userID: message.author.id},{
            $inc: {
                dinero: recompensa
            },
            work: Date.now()
        })
        return message.reply({embeds: [new Discord.MessageEmbed()
            .setAuthor({name: `${message.author.tag}`,iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setDescription(eval(client.la[idioma]["comandos"]["economia"]["work"]["variable2"]))
            .setColor("RANDOM")
            .setTimestamp()
        ]})
    }
}