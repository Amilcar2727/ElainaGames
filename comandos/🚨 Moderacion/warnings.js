const Discord = require("discord.js");

const { paginacion } = require(`${process.cwd()}/handlers/funciones.js`);
const warnSchema = require(`${process.cwd()}/modelos/warns.js`);
const { asegurar_todo } = require(`${process.cwd()}/handlers/funciones.js`);

module.exports = {
    name: "warnings",
    aliases: ["avisos", "user-warns", "warns", "warnings-usuario", "adevertencias"],
    desc: "Sirve para mostrar los warnings de un Usuario",
    permisos: ["VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR", "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES"],
    run: async (client, message, args, prefix, idioma) => {
        const usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member;
        if (usuario.user.bot) return message.reply("💫 ¡ Un **bot** no puede tener warns !");
        await asegurar_todo(message.guild.id, usuario.id);
        let data = await warnSchema.findOne({ guildID: message.guild.id, userID: usuario.id });
        if (data.warnings.length == 0) return message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({ name: "WARNINGS", iconURL: usuario.displayAvatarURL({dynamic: true})})
                .setDescription(eval(client.la[idioma]["comandos"]["moderacion"]["warnings"]["variable1"]))
                .setColor("RANDOM")
                .setTimestamp()
            ]
        });
        const texto = data.warnings.map((warn, index) => eval(client.la[idioma]["comandos"]["moderacion"]["warnings"]["variable2"]));
        paginacion(client, message, texto, eval(client.la[idioma]["comandos"]["moderacion"]["warnings"]["variable3"]), 1, false, usuario);
    }
}