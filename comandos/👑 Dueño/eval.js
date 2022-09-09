const {inspect} = require('util');
const Discord = require('discord.js');
const { config } = require('process');
module.exports = {
    name: "eval",
    aliases: ["evaluar", "ejecutar"],
    desc: "Sirve para ejecutar codigo de discord.js V13", 
    owner: true,
    run: async(client,message,args,prefix,idioma) =>{
        if(!args.length) return message.reply(client.la[idioma]["comandos"]["dueño"]["eval"]["variable1"]);
        try{
            const evaluado = await eval(args.join(" "));
            const truncado = truncar(inspect(evaluado), 2045);
            message.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setTitle(client.la[idioma]["comandos"]["dueño"]["eval"]["titulo"])
                    .setDescription(`\`\`\`js\n${truncado}\`\`\``)
                    .setColor(client.color)
                    .setTimestamp()
                ]
            })

        } catch(e){
            message.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setTitle(client.la[idioma]["comandos"]["dueño"]["eval"]["titulo"])
                    .setDescription(`\`\`\`js\n${e.toString().substring(0,2048)}\`\`\``)
                    .setColor("FF0000")
                    .setTimestamp()
                ]
            })
        }
    }
}

function truncar(texto, n){
    if(texto.length > n){
        return texto.substring(0, n) + "...";
    }else{
        return texto;
    }
}