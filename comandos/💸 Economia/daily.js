const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const duration = require('humanize-duration');
const Discord = require('discord.js')

module.exports = {
    name: "daily",
    aliases: ["diario", "d"],
    desc: "Sirve para reclamar tu recompensa diaria",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES"],
    run: async(client,message,args,prefix,idioma) =>{
        //aseguramos la economia del usuario
        await asegurar_todo(null,message.author.id);
        //leemos la economia del usuario
        let data = await ecoSchema.findOne({userID: message.author.id});
        //definimos cada cuanto tiempo se puede ejecutar el comando en MS
        let tiempo_ms = 24*60*60*1000 //86400000 ms
        let recompensa = 1200;
        //comprobaciones previas
        if(tiempo_ms - (Date.now()-data.daily)>0){
            let tiempo_restante = duration(Date.now()-data.daily- tiempo_ms,{
                language: "es",
                units: ["h","m","s"],
                round: true,
            })
            return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle("Recompensa Diaria")
                .setAuthor({name: `${message.author.tag}`,iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setDescription(eval(client.la[idioma]["comandos"]["economia"]["daily"]["variable1"]))
                .setColor("RANDOM")
                .setTimestamp()
            ]})
        }
        await ecoSchema.findOneAndUpdate({userID: message.author.id},{
            $inc: {
                dinero: recompensa
            },
            daily: Date.now()
        })
        return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle("Recompensa Diaria")
            .setAuthor({name: `${message.author.tag}`,iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setDescription(eval(client.la[idioma]["comandos"]["economia"]["daily"]["variable2"]))
            .setColor("RANDOM")
            .setTimestamp()
        ]})
    }
}