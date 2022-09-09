const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
module.exports = {
    name: "setup-ranking",
    aliases: ["setup-rank","setup-ranks","setup-niveles","setup-nivel","setup-level","setup-levels"],
    desc: "Sirve para crear un sistema de niveles",
    permisos: ["ADMINISTRATOR","MANAGE_CHANNELS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR","MANAGE_CHANNELS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS"],
    run: async(client,message,args,prefix,idioma) =>{

        let uso = `\n**Uso:** \`${prefix}setup-ranking <CANAL> <MENSAJE>\``
        if(!args.length) return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(client.la[idioma]["comandos"]["setup"]["ranking"]["variable1"])
            .setDescription(uso+'\nPalabras reemplazables:\n**Usuario** -> *\`{usuario}\`*')
            .setColor("RANDOM")
            .setTimestamp()
        ]})
        const canalNotificaciones = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
        if(!canalNotificaciones) return message.reply(client.la[idioma]["comandos"]["setup"]["ranking"]["variable2"]);
        
        const mensaje = args.slice(1).join(" ").substring(0, 2048);
        if(!mensaje) return message.reply(client.la[idioma]["comandos"]["setup"]["ranking"]["variable3"]);

        await setupSchema.findOneAndUpdate({guildID: message.guild.id},{
            niveles:{
                canal: canalNotificaciones.id,
                mensaje
            }
        })
        return message.reply({embeds:[
            new Discord.MessageEmbed()
                .setTitle(client.la[idioma]["comandos"]["setup"]["ranking"]["variable4"])
                .setColor("GREEN")
                .setDescription(eval(client.la[idioma]["comandos"]["setup"]["ranking"]["variable5"]))
        ]})

    }
}