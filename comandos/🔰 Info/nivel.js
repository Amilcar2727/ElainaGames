const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
const Levels = require('discord-xp');
const Discord = require('discord.js');

module.exports = {
    name: "nivel",
    aliases: ["level", "rank"],
    desc: "Sirve para ver tu nivel",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES"],
    run: async(client,message,args,prefix,idioma) =>{
        const setupData = await setupSchema.findOneAndUpdate({guildID: message.guild.id});
        if(!setupData || !setupData.niveles || !message.guild.channels.cache.get(setupData.niveles.canal)) return message.reply(client.la[idioma]["comandos"]["info"]["nivel"]["variable1"]);
        const usuario = await Levels.fetch(message.author.id, message.guild.id);
        const xpSiguienteNivel = await Levels.xpFor(usuario.level+1);

        return message.reply({embeds: [new Discord.MessageEmbed()
            .setAuthor({name: `${message.author.tag}`,iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setDescription(eval(client.la[idioma]["comandos"]["info"]["nivel"]["variable2"]))
            .setColor("RANDOM")
            .setTimestamp()
        ]})
    }
}