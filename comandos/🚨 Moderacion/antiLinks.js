const setupSchema =  require(`${process.cwd()}/modelos/setups.js`);
const Discord = require('discord.js');

module.exports = {
    name: "antilinks",
    aliases: ["set-antilinks","setantilinks","antilink"],
    desc: "Sirve para establecer un Sistema de Anti-Links",
    permisos: ["ADMINISTRATOR","MANAGE_CHANNELS","MANAGE_MESSAGES","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES","READ_MESSAGE_HISTORY","MANAGE_ROLES"],
    permisos_bot: ["ADMINISTRATOR","MANAGE_CHANNELS","MANAGE_MESSAGES","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES","MANAGE_ROLES"],
    run: async(client,message,args,prefix,idioma) =>{
        let setups_data = await setupSchema.findOne({guildID: message.guild.id});
        setups_data.antilinks = !setups_data.antilinks
        setups_data.save();
        message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({name: client.la[idioma]["comandos"]["moderacion"]["antiLinks"]["variable1"] ,iconURL: client.user.displayAvatarURL()})
                .setDescription(eval(client.la[idioma]["comandos"]["moderacion"]["antiLinks"]["variable2"]))
                .setColor("RANDOM")
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setTimestamp()
            ]
        });
    }
}