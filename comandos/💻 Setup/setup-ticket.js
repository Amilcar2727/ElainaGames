const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);

module.exports = {
    name: "setup-ticket",
    aliases: ["ticket-setup", "setupticket", "ticketsetup", "setup-tickets"],
    desc: "Sirve para crear un sistema de Tickets",
    permisos: ["ADMINISTRATOR", "MANAGE_CHANNELS", "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR", "MANAGE_CHANNELS", "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"],
    run: async (client, message, args, prefix, idioma) => {
        var objeto = {
            canal: "",
            mensaje: "",

        };
        const quecanal = await message.reply({
            embeds: [new Discord.MessageEmbed()
                .setTitle(client.la[idioma]["comandos"]["setup"]["ticket"]["variable1"])
                .setDescription(client.la[idioma]["comandos"]["setup"]["ticket"]["variable2"])
                .setColor(client.color)
            ]
        });
        await quecanal.channel.awaitMessages({
            filter: m => m.author.id === message.author.id,
            max: 1,
            errors: ["time"],
            time: 180e3
        }).then(async collected => {
            var message = collected.first();
            const channel = message.guild.channels.cache.get(message.content) || message.mentions.channels.first();
            if (channel) {
                objeto.canal = channel.id;
                const quemensaje = await message.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(client.la[idioma]["comandos"]["setup"]["ticket"]["variable3"])
                        .setDescription(client.la[idioma]["comandos"]["setup"]["ticket"]["variable4"])
                        .setColor(client.color)
                    ]
                });
                await quemensaje.channel.awaitMessages({
                    filter: m => m.author.id === message.author.id,
                    max: 1,
                    errors: ["time"],
                    time: 180e3
                }).then(async collected => {
                    var message = collected.first();
                    const msg = await message.guild.channels.cache.get(objeto.canal).send({
                        embeds: [new Discord.MessageEmbed()
                            .setTitle(client.la[idioma]["comandos"]["setup"]["ticket"]["variable5"])
                            .setDescription(`${message.content.substring(0, 2048)}`)
                            .setColor(client.color)
                        ],
                        components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setLabel(client.la[idioma]["comandos"]["setup"]["ticket"]["variable6"]).setEmoji(client.la[idioma]["comandos"]["setup"]["ticket"]["emoji"]).setCustomId("crear_ticket").setStyle("SUCCESS"))]
                    })
                    objeto.mensaje = msg.id;
                    await setupSchema.findOneAndUpdate({ guildID: message.guild.id }, {
                        sistema_tickets: objeto
                    });
                    return message.reply({ embeds: [new Discord.MessageEmbed()
                        .setTitle(client.la[idioma]["comandos"]["setup"]["ticket"]["variable7"])
                        .setDescription(eval(client.la[idioma]["comandos"]["setup"]["ticket"]["variable7.1"]))
                        .setColor("RANDOM")
                        .setTimestamp()
                    ]})
                }).catch(() => {
                    return message.reply(client.la[idioma]["comandos"]["setup"]["ticket"]["tiempo"])
                })
            } else {
                return message.reply(client.la[idioma]["comandos"]["setup"]["ticket"]["variable8"])
            }
        }).catch(() => {
            return message.reply(client.la[idioma]["comandos"]["setup"]["ticket"]["tiempo"])
        })
    }
}