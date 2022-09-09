const Discord = require('discord.js');
const serverSchema = require(`${process.cwd()}/modelos/servidor.js`);

module.exports = {
    name: "val-premium",
    aliases: [],
    desc: "Sirve para comprobar si tu servidor es Premium",
    premium: true,
    permisos: ["ADMINISTRATOR","MANAGE_CHANNELS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR","MANAGE_CHANNELS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS"],
    run: async(client,message,args,prefix,idioma) =>{
        const clave = await serverSchema.findOne({guildID: message.guild.id});
        return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[idioma]["comandos"]["premium"]["val-premium"]["variable1"]))
            .setDescription(eval(client.la[idioma]["comandos"]["premium"]["val-premium"]["variable2"]))
            .setThumbnail(message.guild.iconURL({dynamic: true}))
        ]
        })
    }
}