const Discord = require('discord.js')
const config = require(`${process.cwd()}/config/config.json`)
const { parse } = require("twemoji-parser");

module.exports = {
    name: "addemoji",
    aliases: ["add-emoji", "emojiadd", "emoji-add"],
    desc: "Sirve para agregar emojis al servidor.",
    premium: true,
    permisos: ["MANAGE_EMOJIS", "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "USE_EXTERNAL_EMOJIS", "MANAGE_EMOJIS_AND_STICKERS"],
    permisos_bot: ["ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "MANAGE_EMOJIS_AND_STICKERS"],

    run: async (client, message, args, prefix, idioma) => {

        const emojis = args.join(" ").match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/gi)
        if (!emojis) {

            const embed = new Discord.MessageEmbed()
                .setTitle(client.la[idioma]["comandos"]["premium"]["addEmoji"]["error"])
                .setDescription(client.la[idioma]["comandos"]["premium"]["addEmoji"]["variable1"])
                .setFooter({
                    text: eval(client.la[idioma]["comandos"]["premium"]["addEmoji"]["variable2"]),
                    iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`
                })
                .setTimestamp()
                .setColor(config.colorErr)
            return message.channel.send({
                embeds: [embed]
            })
        }
        emojis.forEach(emote => {
            let emoji = Discord.Util.parseEmoji(emote);
            if (emoji.id) {
                const Link = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`
                message.guild.emojis.create(`${Link}`, `${`${emoji.name}`}`).then(em => {
                    let server = message.guild;
                    let emebedcorrect = new Discord.MessageEmbed()
                        .setTitle(client.la[idioma]["comandos"]["premium"]["addEmoji"]["correcto"])
                        .setDescription(eval(client.la[idioma]["comandos"]["premium"]["addEmoji"]["variable3"]))
                        .setColor(config.color)
                        .setFooter({
                            text: server.name,
                            iconURL: server.iconURL({
                                dynamic: true
                            })
                        })
                        .setTimestamp()
                    message.channel.send({
                        embeds: [emebedcorrect]
                    });
                }).catch(error => {
                    message.channel.send(client.la[idioma]["comandos"]["premium"]["addEmoji"]["error"])
                    console.log(error)

                })

            }
        })
    }
}