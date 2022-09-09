const Discord = require("discord.js");
const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`);
const warnSchema = require(`${process.cwd()}/modelos/warns.js`);
module.exports = {
    name: "ban",
    aliases: ["banear", "banuser"],
    desc: "Sirve para banear a un usuario del servidor",
    permisos: ["ADMINISTRATOR", "BAN_MEMBERS","VIEW_AUDIT_LOG","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR", "BAN_MEMBERS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS"],
    run: async (client, message, args, prefix,idioma) => {
        //Definimos la persona a banear 
        let uso = `\n**Uso:** \`${prefix}ban <USUARIO> <MOTIVO>\``
        if(!args.length) return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(client.la[idioma]["comandos"]["moderacion"]["ban"]["uso"])
            .setDescription(uso)
            .setColor("RANDOM")
            .setTimestamp()
        ]})
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!usuario) return message.reply(client.la[idioma]["comandos"]["moderacion"]["ban"]["variable1"]);
        if(usuario.id === message.author.id) return message.reply("💫 No puedes banearte a ti mismo -.-");
        if(usuario.id === "953575359041929236") return message.reply(client.la[idioma]["comandos"]["moderacion"]["ban"]["elaina"]);
        //Buscamos los numeros de warns que tuvo la persona
        await asegurar_todo(message.guild.id, usuario.id);
        let data = await warnSchema.findOne({guildID: message.guild.id, userID: usuario.id});
        let nrowarns = data.warnings.length;
        //razon
        let razon = args.slice(1).join(" ");
        if(!razon) razon = client.la[idioma]["comandos"]["moderacion"]["ban"]["variable2"];
        //Comprobar que el bot está por encima del usuario a banear
        if (message.guild.me.roles.highest.position > usuario.roles.highest.position) {
            //Comprobar que la posición del rol del usuario que ejecuta el comando sea mayor a la persona que vaya a banear
            if (message.member.roles.highest.position > usuario.roles.highest.position) {
                //enviamos al usuario por privado que ha sido baneado
                usuario.send({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[idioma]["comandos"]["moderacion"]["ban"]["variable3"]))
                        .setDescription(eval(client.la[idioma]["comandos"]["moderacion"]["ban"]["razon"]))
                        .setColor(client.color)
                        .setTimestamp()
                        .setFooter({text: "~ ElainaNew ~", iconURL: `${client.user.displayAvatarURL()}`})
                    ]
                }).catch(()=>{message.reply(client.la[idioma]["comandos"]["moderacion"]["ban"]["variable4"])});
                //enviamos en el canal que el usuario ha sido baneado exitosamente
                message.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(client.la[idioma]["comandos"]["moderacion"]["ban"]["variable5"])
                        .setDescription(eval(client.la[idioma]["comandos"]["moderacion"]["ban"]["variable6"]))
                        .addField(client.la[idioma]["comandos"]["moderacion"]["ban"]["field"],eval(client.la[idioma]["comandos"]["moderacion"]["ban"]["fieldr"]))
                        .setColor(client.color)
                        .setImage("https://i.pinimg.com/originals/a1/06/95/a10695cd3635e9b6b56ee7a7e30b719c.jpg")
                        .setTimestamp()
                        .setFooter({text: "~ ElainaNew - Trazo suavemente la tinta sangrante ~", iconURL: `${client.user.displayAvatarURL()}`})
                    ]
                })
                usuario.ban({reason: razon}).catch(()=>{
                    return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(client.la[idioma]["comandos"]["moderacion"]["ban"]["variable7"])
                        .setColor(Client.color)
                    ]})
                })
            } else {
                return message.reply(client.la[idioma]["comandos"]["moderacion"]["ban"]["variable8"]);
            }
        } else {
            return message.reply(client.la[idioma]["comandos"]["moderacion"]["ban"]["variable9"]);
        }


    }
}