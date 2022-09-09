const ms = require('ms');
const Discord = require('discord.js')
module.exports = {
    name: "giveaway",
    aliases: ["sorteo", "sorteos", "giveaways"],
    desc: "Sirve administrar/crear un sistema de sorteos",
    permisos: ["ADMINISTRATOR", "MANAGE_CHANNELS", "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR", "MANAGE_CHANNELS", "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"],
    run: async (client, message, args, prefix, idioma) => {
        //definimos los metodos del sorteos
        let metodos = ["start"]; //"reroll", "end"
        if (!args || !metodos.includes(args[0])) return message.reply({
            embeds: [new Discord.MessageEmbed()
                .setTitle(client.la[idioma]["comandos"]["moderacion"]["sorteos"]["variable1"])
                .setColor("RANDOM")
                .setDescription(`**Uso:** \`${prefix}sorteo [método]\`\n**Métodos disponibles:** ${metodos.map(metodo => `\`${metodo}\``).join(", ")}`)
            ]
        });

        switch (args[0]) {
            case "start": {
                let embed = new Discord.MessageEmbed()
                    .setDescription(`**Uso:** \`${prefix}sorteo start <#canal> <duración> <ganadores> <premio>\``)
                    .setColor("RANDOM");

                let canal = message.guild.channels.cache.get(args[1]) || message.mentions.channels.first();
                if (!canal) return message.reply({
                    embeds: [embed.setTitle(client.la[idioma]["comandos"]["moderacion"]["sorteos"]["variable2"])]
                })
                let tiempo = args[2];
                if (!tiempo) return message.reply({
                    embeds: [embed.setTitle(client.la[idioma]["comandos"]["moderacion"]["sorteos"]["variable3"])]
                })
                let tiempo_en_ms = ms(args[2]);
                if (!tiempo_en_ms || isNaN(tiempo_en_ms) || tiempo_en_ms < 0 || tiempo_en_ms % 1 != 0) return message.reply({
                    embeds: [embed.setTitle(client.la[idioma]["comandos"]["moderacion"]["sorteos"]["variable3"])]
                })
                let ganadores = Number(args[3]);
                if (!ganadores || isNaN(ganadores) || ganadores < 0 || ganadores % 1 != 0) return message.reply({
                    embeds: [embed.setTitle(client.la[idioma]["comandos"]["moderacion"]["sorteos"]["variable4"])]
                })
                let premio = args.slice(4).join(" ");
                if (!premio) return message.reply({
                    embeds: [embed.setTitle(client.la[idioma]["comandos"]["moderacion"]["sorteos"]["variable5"])]
                });

                client.giveawaysManager.start(canal, {
                    duration: tiempo_en_ms,
                    winnerCount: Number(ganadores),
                    prize: premio,
                    hostedBy: message.author,
                    embedColor: "RANDOM",
                    messages: {
                        giveaway: "🎉🎉 **NUEVO SORTEO** 🎉🎉",
                        giveawayEnded: "**SORTEO FINALIZADO** ⌚",
                        inviteToParticipate: "Reacciona con 🎉 para participar!",
                        winMessage: eval(client.la[idioma]["comandos"]["moderacion"]["sorteos"]["variable6"]),
                        winners: client.la[idioma]["comandos"]["moderacion"]["sorteos"]["variable7"],
                        hostedBy: eval(client.la[idioma]["comandos"]["moderacion"]["sorteos"]["variable8"]),
                        endedAt: client.la[idioma]["comandos"]["moderacion"]["sorteos"]["variable9"],
                        drawing: eval(client.la[idioma]["comandos"]["moderacion"]["sorteos"]["variable10"])
                    }
                }).then(() => {
                    return message.reply(eval(client.la[idioma]["comandos"]["moderacion"]["sorteos"]["variable11"]))
                })
            }
                break;
            default:
                break;
        }
    }
}