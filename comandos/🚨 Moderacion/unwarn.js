const Discord = require("discord.js");
const { asegurar_todo } = require(`${process.cwd()}/handlers/funciones.js`)
const warnSchema = require(`${process.cwd()}/modelos/warns.js`)
module.exports = {
    name: "unwarn",
    aliases: ["deswarnear", "remove-warn", "quitar-aviso", "unwarns"],
    desc: "Sirve para quitar un aviso a un usuario del servidor",
    permisos: ["ADMINISTRATOR", "BAN_MEMBERS","VIEW_AUDIT_LOG","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR", "BAN_MEMBERS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS"],
    run: async (client, message, args, prefix,idioma) => {
        //Definimos la persona a avisar 
        let uso = `\n**Uso:** \`${prefix}unwarn <USER> <ID-WARN>\`\n*Para saber la **<ID-WARN>** verifica los warns del usuario con: \`${prefix}warns <USER>\`*`
        if(!args.length) return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(client.la[idioma]["comandos"]["moderacion"]["unwarn"]["variable1"])
            .setDescription(uso)
            .setColor("RANDOM")
            .setTimestamp()
        ]})
        
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!usuario) return message.reply(client.la[idioma]["comandos"]["moderacion"]["unwarn"]["variable2"]);
        if(usuario.id === message.author.id) return message.reply("💫 No puedes quitarte tu mismo un warn .-.");
        if(usuario.user.bot) return message.reply("💫 Los **bots** no pueden tener warns.");

        await asegurar_todo(message.guild.id, usuario.id);
        let id_warn = args[1];

        let data = await warnSchema.findOne({ guildID: message.guild.id, userID: usuario.id });
        if (data.warnings.length === 0) return message.reply(client.la[idioma]["comandos"]["moderacion"]["unwarn"]["variable3"]);

        if (!id_warn) return message.reply(client.la[idioma]["comandos"]["moderacion"]["unwarn"]["variable4"]);
        if (isNaN(id_warn) || id_warn < 0) return message.reply(client.la[idioma]["comandos"]["moderacion"]["unwarn"]["variable5"]);
        if (data.warnings[id_warn] == undefined) return message.reply(client.la[idioma]["comandos"]["moderacion"]["unwarn"]["variable6"]);

        //Comprobar que el bot está por encima del usuario a avisar
        if (message.guild.me.roles.highest.position > usuario.roles.highest.position) {
            //Comprobar que la posición del rol del usuario que ejecuta el comando sea mayor a la persona que vaya a avisar
            if (message.member.roles.highest.position > usuario.roles.highest.position) {
                message.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(client.la[idioma]["comandos"]["moderacion"]["unwarn"]["titulo"])
                        .setDescription(eval(client.la[idioma]["comandos"]["moderacion"]["unwarn"]["variable7"]))
                        .setColor(client.color)
                        .setTimestamp()
                        .setThumbnail(usuario.displayAvatarURL({dynamic: true}))
                        .setFooter({text: "~ ElainaNew - Trazo suavemente la tinta sangrante ~", iconURL: `${client.user.displayAvatarURL()}`})
                    ]
                })
                data.warnings.splice(id_warn, 1);
                data.save();
            } else {
                return message.reply(client.la[idioma]["comandos"]["moderacion"]["unwarn"]["variable8"]);
            }
        } else {
            return message.reply(client.la[idioma]["comandos"]["moderacion"]["unwarn"]["variable9"]);
        }
    }
}