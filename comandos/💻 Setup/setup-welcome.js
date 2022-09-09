const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);

module.exports = {
    name: "setup-welcome",
    aliases: ["bienvenida-setup", "setup-bienvenidas", "setup-welcomes"],
    desc: "Sirve para crear un sistema de Bienvenidas",
    permisos: ["ADMINISTRATOR","MANAGE_CHANNELS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR","MANAGE_CHANNELS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS","ATTACH_FILES"],
    run: async (client, message, args, prefix,idioma) => {
        let uso = `\n**Uso:** \`${prefix}setup-welcome <CANAL> <IMAGEN> <Texto de Bienvenida>\``
        if(!args.length) return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(client.la[idioma]["comandos"]["setup"]["welcome"]["variable1"])
            .setDescription(`${uso}\n`+'\nPalabras reemplazables:\n**Usuario** -> *\`{user}\`*\n**Tag de Usuario** -> *\`{usertag}\`*\n**Nombre de Usuario** -> *\`{username}\`*\n**Server** -> *\`{servername}\`*')
            .setColor("RANDOM")
            .setTimestamp()
        ]})

        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
        if(!channel || channel.type !== "GUILD_TEXT") return message.reply(client.la[idioma]["comandos"]["setup"]["welcome"]["variable2"]+ uso);
        if(!args[1]) return message.reply(client.la[idioma]["comandos"]["setup"]["welcome"]["variable3"]);
        if(!args[2]) return message.reply(client.la[idioma]["comandos"]["setup"]["welcome"]["variable4"]);
        await setupSchema.findOneAndUpdate({guildID: message.guild.id}, {
            bienvenida: {
                canal: channel.id,
                imagen: args[1],
                mensaje: args.slice(2).join(" "),
            }
        })
        return message.reply({
            embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[idioma]["comandos"]["setup"]["welcome"]["variable5"]))
            .setDescription(eval(client.la[idioma]["comandos"]["setup"]["welcome"]["variable6"]))
            .setColor(client.color)
            ]
        })
    }
}