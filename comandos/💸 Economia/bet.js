const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const Discord = require("discord.js");

module.exports = {
    name: "bet",
    aliases: ["apostar"],
    desc: "Sirve para apostar una cantidad de dinero",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES"],
    run: async(client,message,args,prefix,idioma) =>{
        //aseguramos la economia del usuario
        await asegurar_todo(null,message.author.id);
        //leemos la economia del usuario
        let data = await ecoSchema.findOne({userID: message.author.id});
        let cantidad = args[0];
        //comprobaciones previas
        if(data.dinero == 0) return message.reply(client.la[idioma]["comandos"]["economia"]["bet"]["variable1"])
        if(["todo","all-in","all"].includes(args[0])){
            cantidad = data.dinero;
        }else{
            if(isNaN(cantidad) || cantidad <= 0 || cantidad %1!=0) return message.reply(client.la[idioma]["comandos"]["economia"]["bet"]["variable2"])
            if(cantidad > data.dinero) return message.reply(client.la[idioma]["comandos"]["economia"]["bet"]["variable3"]);
        }
        //creamos las posibilidades
        let posibilidades = ["ganar","perder"];
        //definimos el resultado de las posibilidades
        let resultado = posibilidades[Math.floor(Math.random()*posibilidades.length)];
        //si el resultado es ganar, la persona gana lo que apueste, caso contrario pierde lo apostado
        if(resultado === "ganar"){
            await ecoSchema.findOneAndUpdate({userID: message.author.id},{
                $inc:{
                    dinero: cantidad
                }
            })
            return message.reply({embeds: [new Discord.MessageEmbed()
                .setAuthor({name: `${message.author.tag}`,iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setDescription(eval(client.la[idioma]["comandos"]["economia"]["bet"]["variable4"]))
                .setColor("RANDOM")
                .setTimestamp()
            ]})
        }else{
            await ecoSchema.findOneAndUpdate({userID: message.author.id},{
                $inc:{
                    dinero: -cantidad
                }
            })
            return message.reply({embeds: [new Discord.MessageEmbed()
                .setAuthor({name: `${message.author.tag}`,iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setDescription(eval(client.la[idioma]["comandos"]["economia"]["bet"]["variable5"]))
                .setColor("RANDOM")
                .setTimestamp()
            ]})
        }

    }
}