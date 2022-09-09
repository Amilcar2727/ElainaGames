const setupSchema =  require(`${process.cwd()}/modelos/setups.js`);
const Discord = require('discord.js');

module.exports = {
    name: "antidiscord",
    aliases: ["set-antidiscord", "set-discordlinks","setdiscordlink","antidiscordlink","antidiscordlinks"],
    desc: "Sirve para establecer un Sistema de Proteccion contra Enlaces de Discord",
    permisos: ["ADMINISTRATOR","MANAGE_CHANNELS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES","READ_MESSAGE_HISTORY","MANAGE_ROLES"],
    permisos_bot: ["ADMINISTRATOR","MANAGE_CHANNELS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES","MANAGE_ROLES"],
    run: async(client,message,args,prefix,idioma) =>{
        
        let setups_data = await setupSchema.findOne({guildID: message.guild.id});
        setups_data.antiDiscord = !setups_data.antiDiscord
        setups_data.save();
        message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({name: client.la[idioma]["comandos"]["moderacion"]["antiDiscord"]["variable1"] ,iconURL: client.user.displayAvatarURL()})
                .setDescription(eval(client.la[idioma]["comandos"]["moderacion"]["antiDiscord"]["variable2"]))
                .setColor("RANDOM")
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setTimestamp()
            ]
        });
    }
}