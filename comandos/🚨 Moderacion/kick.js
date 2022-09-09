const Discord = require("discord.js");

module.exports = {
    name: "kick",
    aliases: ["kickear", "expulsar"],
    desc: "Sirve para expulsar a un usuario del servidor",
    permisos: ["ADMINISTRATOR", "KICK_MEMBERS", "VIEW_AUDIT_LOG", "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR", "KICK_MEMBERS", "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"],
    run: async (client, message, args, prefix, idioma) => {
        //Definimos la persona a banear
        let uso = `\n**Uso:** \`${prefix}kick <USUARIO> <MOTIVO>\``
        if(!args.length) return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(client.la[idioma]["comandos"]["moderacion"]["kick"]["uso"])
            .setDescription(uso)
            .setColor("RANDOM")
            .setTimestamp()
        ]})
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!usuario) return message.reply(client.la[idioma]["comandos"]["moderacion"]["kick"]["variable1"]);
        if(usuario.id === message.author.id) return message.reply("💫 No puedes kickearte a ti mismo -.-");
        if(usuario.id === "953575359041929236") return message.reply(client.la[idioma]["comandos"]["moderacion"]["kick"]["elaina"]);
        let razon = args.slice(1).join(" ");
        if (!razon) razon = client.la[idioma]["comandos"]["moderacion"]["kick"]["variable2"];
        //Comprobar que el bot está por encima del usuario a banear
        if (message.guild.me.roles.highest.position > usuario.roles.highest.position) {
            //Comprobar que la posición del rol del usuario que ejecuta el comando sea mayor a la persona que vaya a banear
            if (message.member.roles.highest.position > usuario.roles.highest.position) {
                //enviamos al usuario por privado que ha sido baneado
                usuario.send({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[idioma]["comandos"]["moderacion"]["kick"]["variable3"]))
                        .setDescription(eval(client.la[idioma]["comandos"]["moderacion"]["kick"]["razon"]))
                        .setColor(client.color)
                        .setTimestamp()
                        .setFooter({text: "~ ElainaNew ~", iconURL: `${client.user.displayAvatarURL()}`})
                    ]
                }).catch(() => { message.reply(client.la[idioma]["comandos"]["moderacion"]["kick"]["variable4"]) });
                //enviamos en el canal que el usuario ha sido baneado exitosamente
                message.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(client.la[idioma]["comandos"]["moderacion"]["kick"]["variable5"])
                        .setDescription(eval(client.la[idioma]["comandos"]["moderacion"]["kick"]["variable6"]))
                        .addField(client.la[idioma]["comandos"]["moderacion"]["kick"]["field"], eval(client.la[idioma]["comandos"]["moderacion"]["kick"]["fieldr"]))
                        .setColor(client.color)
                        .setImage("https://i.pinimg.com/originals/59/43/0b/59430b3d8471598e059d10d9dec8ff2d.jpg")
                        .setTimestamp()
                        .setFooter({text: "~ ElainaNew - Trazo suavemente la tinta sangrante ~", iconURL: `${client.user.displayAvatarURL()}`})
                    ]
                })
                usuario.kick([razon])
            } else {
                return message.reply(client.la[idioma]["comandos"]["moderacion"]["kick"]["variable7"]);
            }
        } else {
            return message.reply(client.la[idioma]["comandos"]["moderacion"]["kick"]["variable8"]);
        }
    }
}