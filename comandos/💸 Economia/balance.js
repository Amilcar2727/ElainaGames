const Discord = require("discord.js");
const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
module.exports = {
    name: "balance",
    aliases: ["dinero", "cartera","bal","wallet","bank"],
    desc: "Sirve para ver la cartera de un Usuario",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES","EMBED_LINKS"],
    run: async(client,message,args,prefix,idioma) =>{
        const user = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member;
        if(user.user.bot && user.id != "953575359041929236") return message.reply(client.la[idioma]["comandos"]["economia"]["balance"]["variable1"]);
        await asegurar_todo(null,user.id);
        let data = await ecoSchema.findOne({userID: user.id});
        message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({name: eval(client.la[idioma]["comandos"]["economia"]["balance"]["titulo"]),iconURL: user.displayAvatarURL({dynamic: true})})
                .setDescription(eval(client.la[idioma]["comandos"]["economia"]["balance"]["contenido"]))
                .setColor(client.color)
                .setTimestamp()
            ]
        });
    }
}