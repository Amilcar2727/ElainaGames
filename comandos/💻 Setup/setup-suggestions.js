const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);

module.exports = {
    name: "setup-suggestions",
    aliases: ["setup-suggestion", "setup-sugerencias", "setup-sugerencia", "setupsugerencias"],
    desc: "Sirve para crear un Sistema de Sugerencias", 
    permisos: ["ADMINISTRATOR","MANAGE_CHANNELS","ADD_REACTIONS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR","MANAGE_CHANNELS","ADD_REACTIONS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS"],
    run: async(client,message,args,prefix,idioma) =>{
        let uso = `\n**Uso:** \`${prefix}setup-suggestions <CANAL>\``
        if(!args.length) return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(client.la[idioma]["comandos"]["setup"]["suggestion"]["variable1"])
            .setDescription(uso)
            .setColor("RANDOM")
            .setTimestamp()
        ]})
        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
        if(!channel||channel.type !== "GUILD_TEXT") return message.reply(client.la[idioma]["comandos"]["setup"]["suggestion"]["variable2"])
        await setupSchema.findOneAndUpdate({guildID: message.guild.id},{
            sugerencias: channel.id
        })
        return message.reply({
            embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[idioma]["comandos"]["setup"]["suggestion"]["variable3"]))
                .setDescription(eval(client.la[idioma]["comandos"]["setup"]["suggestion"]["variable4"]))
                .setColor(client.color)
            ]
        })
    }
}