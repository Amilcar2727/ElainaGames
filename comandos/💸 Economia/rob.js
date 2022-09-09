const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const duration = require('humanize-duration');
const Discord = require('discord.js');

module.exports = {
    name: "rob",
    aliases: ["steal","robar","r"],
    desc: "Sirve para robar monedas a un usuario",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES"],
    run: async(client,message,args,prefix,idioma) =>{
        if(!args.length) return message.reply(client.la[idioma]["comandos"]["economia"]["rob"]["variable1"]);
        const usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if(!usuario) return message.reply(client.la[idioma]["comandos"]["economia"]["rob"]["variable2"]);
        if(usuario.user.bot && usuario.id != "953575359041929236") return message.reply(client.la[idioma]["comandos"]["economia"]["balance"]["variable1"]);
        if(usuario.id == message.author.id) return message.reply(client.la[idioma]["comandos"]["economia"]["rob"]["variable3"]);
        //aseguramos la economia del usuario a robar
        await asegurar_todo(null,usuario.id);
        //leemos la economia del usuario
        let data = await ecoSchema.findOne({userID: message.author.id});
        //definimos cada cuanto tiempo se puede ejecutar el comando en MS
        let tiempo_ms = 5*60*1000; //300000 ms - 5 minutos
        //comprobaciones previas
        if(tiempo_ms - (Date.now()-data.rob)>0){
            let tiempo_restante = duration(Date.now()-data.rob- tiempo_ms,{
                language: "es",
                units: ["h","m","s"],
                round: true,
            })
            return message.reply({embeds: [new Discord.MessageEmbed()
                .setAuthor({name: `${message.author.tag}`,iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setDescription(eval(client.la[idioma]["comandos"]["economia"]["rob"]["variable4"]))
                .setColor("RANDOM")
                .setTimestamp()
            ]})
        }
        //definimos la economia del usuario que robará
        let data_usuario = await ecoSchema.findOne({userID: usuario.id});
        if(data_usuario.dinero < 500) return message.reply(client.la[idioma]["comandos"]["economia"]["rob"]["variable5"]);  
        let cantidad = Math.floor(Math.random()*400)+100;
        //comprobaciones previas
        if(cantidad > data_usuario.dinero) return message.reply(client.la[idioma]["comandos"]["economia"]["rob"]["variable6"]);
        //le quitamos las monedas al usuario DE SU CARTERA y las introducimos en la nuestra, añadiendo la fecha de cuando se ha ejecutado el comando "rob"
        await ecoSchema.findOneAndUpdate({userID: message.author.id}, {
            $inc: {
                dinero: cantidad,
            },
            rob: Date.now()
        })
        //le quitamos las monedas al usuario de SU CARTERA
        await ecoSchema.findOneAndUpdate({userID: usuario.id}, {
            $inc: {
                dinero: -cantidad,
            },
        })
        return message.reply({embeds: [new Discord.MessageEmbed()
            .setAuthor({name: `${message.author.tag}`,iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setDescription(eval(client.la[idioma]["comandos"]["economia"]["rob"]["variable7"]))
            .setColor("RANDOM")
            .setTimestamp()
        ]})
    }
}