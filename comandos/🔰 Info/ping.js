const Discord = require('discord.js');
module.exports = {
    name: "ping",
    aliases: ["latencia", "ms"],
    desc: "Sirve para ver la latencia del Bot",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES"],
    run: async(client,message,args,prefix,idioma) =>{
        message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({name: `ElainaNew`,iconURL: client.user.displayAvatarURL({dynamic: true})})
                .setDescription(eval(client.la[idioma]["comandos"]["info"]["ping"]["variable1"]))
                .setColor(client.color)
                .setTimestamp()
            ]
        });
    }
}