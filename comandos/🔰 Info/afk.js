const Discord = require('discord.js');
const afkSchema = require(`${process.cwd()}/modelos/afk.js`);
module.exports = {
    name: "afk",
    aliases: [],
    desc: "Sirve para que te pongas en estado afk, y el bot informe a los que te mencionen",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES"],
    run: async(client,message,args,prefix,idioma) =>{
        const reason = args.join(' ') || 'No dijo nada';
        afkSchema.findOne({
            Guild: message.guild.id,
            User: message.author.id,
        },async(err,data)=>{
            if(!data){
                new afkSchema({
                    Guild: message.guild.id,
                    User: message.author.id,
                    Razon: reason,
                    Date: Date.now()
                }).save();
                message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setAuthor({name: `${message.author.tag}`})
                        .setTitle("- ESTADO AFK -")
                        .setDescription(`**Razón:** \`${reason}\``)
                        .setThumbnail(`${message.author.displayAvatarURL()}`)
                        .setColor("RANDOM")
                        .setFooter({text: `~ Les daré aviso a los que te busquen ~ ElainaNew`})
                    ],
                });
            }
        });

    }
}