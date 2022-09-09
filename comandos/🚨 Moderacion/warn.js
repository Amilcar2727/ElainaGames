const Discord = require("discord.js");
const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`)
const warnSchema = require(`${process.cwd()}/modelos/warns.js`)
module.exports = {
    name: "warn",
    aliases: ["warnear", "avisar","advertir"],
    desc: "Sirve para enviar un aviso a un usuario del servidor",
    permisos: ["ADMINISTRATOR", "BAN_MEMBERS","VIEW_AUDIT_LOG","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR", "BAN_MEMBERS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS"],
    run: async (client, message, args, prefix,idioma) => {
        //Definimos la persona a avisar 
        let uso = `\n**Uso:** \`${prefix}warn <USER> <MOTIVO>\``
        if(!args.length) return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(client.la[idioma]["comandos"]["moderacion"]["warn"]["variable1"])
            .setDescription(uso)
            .setColor("RANDOM")
            .setTimestamp()
        ]})

        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!usuario) return message.reply(client.la[idioma]["comandos"]["moderacion"]["warn"]["variable2"]);
        if(usuario.id === message.author.id) return message.reply("💫 No puedes warnearte a ti mismo . -.");
        if(usuario.user.bot) return message.reply(client.la[idioma]["comandos"]["moderacion"]["warn"]["bot"]);

        await asegurar_todo(message.guild.id,usuario.id);
        let razon = args.slice(1).join(" ");
        if(!razon) razon = client.la[idioma]["comandos"]["moderacion"]["warn"]["variable3"];
        //Comprobar que el bot está por encima del usuario a avisar
        if (message.guild.me.roles.highest.position > usuario.roles.highest.position) {
            //Comprobar que la posición del rol del usuario que ejecuta el comando sea mayor a la persona que vaya a avisar
            if (message.member.roles.highest.position > usuario.roles.highest.position) {
                //enviamos al usuario por privado que ha sido avisado
                usuario.send({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[idioma]["comandos"]["moderacion"]["warn"]["variable4"]))
                        .setDescription(eval(client.la[idioma]["comandos"]["moderacion"]["warn"]["razon"]))
                        .setColor(client.color)
                        .setTimestamp()
                        .setFooter({text: "~ ElainaNew ~", iconURL: `${client.user.displayAvatarURL()}`})
                    ]
                }).catch(()=>{message.reply(client.la[idioma]["comandos"]["moderacion"]["warn"]["variable5"])});
                //enviamos en el canal que el usuario ha sido avisado exitosamente
                message.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(client.la[idioma]["comandos"]["moderacion"]["warn"]["variable6"])
                        .setDescription(eval(client.la[idioma]["comandos"]["moderacion"]["warn"]["variable7"]))
                        .addField(client.la[idioma]["comandos"]["moderacion"]["warn"]["field"],eval(client.la[idioma]["comandos"]["moderacion"]["warn"]["fieldr"]))
                        .setColor("RANDOM")
                        .setThumbnail(usuario.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        .setFooter({text: "~ ElainaNew - Trazo suavemente la tinta sangrante ~", iconURL: `${client.user.displayAvatarURL()}`})
                    ]
                })
                //creamos el objeto del warn
                let objeto_warn = {
                    fecha: Date.now(),
                    autor: message.author.id,
                    razon,
                }
                //empujamos el objeto en la base de datos
                await warnSchema.findOneAndUpdate({guildID: message.guild.id, userID: usuario.id},{
                    $push: {
                        warnings: objeto_warn
                    }
                }) 

            } else {
                return message.reply(client.la[idioma]["comandos"]["moderacion"]["warn"]["variable8"]);
            }
        } else {
            return message.reply(client.la[idioma]["comandos"]["moderacion"]["warn"]["variable9"]);
        }


    }
}