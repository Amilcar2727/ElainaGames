const Discord = require("discord.js");
module.exports = {
    name: "md",
    aliases: ["dm","mensaje"],
    desc: "Sirve para enviar un MD a un usuario del servidor",
    owner: true,
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES"],
    run: async(client,message,args,prefix,idioma) =>{
        //Definimos la persona
        let uso = `\n**Uso:** \`${prefix}md <USUARIO> <MENSAJE>\``
        if(!args.length) return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(client.la[idioma]["comandos"]["dueño"]["md"]["variable1"])
            .setDescription(uso+client.la[idioma]["comandos"]["dueño"]["md"]["variable2"])
            .setColor(client.color)
        ]})
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!usuario) return message.reply(client.la[idioma]["comandos"]["dueño"]["md"]["variable3"]);
        if(usuario.user.bot) return message.reply(client.la[idioma]["comandos"]["dueño"]["md"]["variable4"]);

        let razon = args.slice(1).join(" ");
        if (!razon) return message.reply(client.la[idioma]["comandos"]["dueño"]["md"]["variable5"]);
        usuario.send({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({name: `MENSAJE DIRECTO DE ${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})
                .setDescription(`**Servidor-Origen:** \`${message.guild.name}\`\n━━━━━━━ • ஜ • ❈ • ஜ • ━━━━━━━\n${razon}`)
                .setColor("WHITE")
                .setTimestamp()
                .setFooter({text: " ~ ElainaNew"})
            ]
        }).then(message.reply(eval(client.la[idioma]["comandos"]["dueño"]["md"]["variable6"]))).catch(() => {message.reply(eval(client.la[idioma]["comandos"]["dueño"]["md"]["variable7"]))});
    }
}