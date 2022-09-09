const setupSchema =  require(`${process.cwd()}/modelos/setups.js`);
const Discord = require('discord.js');

module.exports = {
    name: "miniaturas",
    aliases: ["minis","set-miniaturas","setminiaturas"],
    desc: "Sirve para establecer un MD con info sobre las miniaturas a los usuario nuevos",
    permisos: ["ADMINISTRATOR"],
    permisos_bot: ["ADMINISTRATOR"],
    run: async(client,message,args,prefix,idioma) =>{
        let setups_data = await setupSchema.findOne({guildID: message.guild.id});
        setups_data.miniaturas = !setups_data.miniaturas
        setups_data.save();
        message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({name: client.la[idioma]["comandos"]["moderacion"]["miniaturas"]["variable1"] ,iconURL: client.user.displayAvatarURL()})
                .setDescription(eval(client.la[idioma]["comandos"]["moderacion"]["miniaturas"]["variable2"])+`\n`+client.la[idioma]["comandos"]["moderacion"]["miniaturas"]["variable3"])
                .setColor("RANDOM")
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setTimestamp()
            ]
        });
    }
}