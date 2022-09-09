const ms = require('ms');
const Discord = require('discord.js');
const keySchema = require(`${process.cwd()}/modelos/clave.js`);
module.exports = {
    name: "keygen",
    aliases: ["generar-clave", "generarclave"],
    desc: "Sirve para generar una clave premium para un servidor", 
    owner: true,
    run: async(client,message,args,prefix,idioma) =>{
        if(!args.length) return message.reply(client.la[idioma]["comandos"]["dueño"]["keygen"]["variable1"])
        const tiempo = ms(args[0]) // pasar el tiempo que ha especificado el usuario a milisegundos 
        if(tiempo){
            let clave = generar_clave();
            let data = new keySchema({
                clave,
                duracion: tiempo,
                activado: false,
            });
            message.author.send({
                embeds: [new Discord.MessageEmbed()
                    .setTitle(client.la[idioma]["comandos"]["dueño"]["keygen"]["titulo"])
                    .setDescription("```"+clave+"```")
                    .addField(client.la[idioma]["comandos"]["dueño"]["keygen"]["field"],eval(client.la[idioma]["comandos"]["dueño"]["keygen"]["fieldr"]))
                    .addField(`Suscripción`,`\`${args[0]}\``)
                    .addField(`Estado`,`\`SIN USAR\``)
                    .setColor(client.color)
                ]
            }).catch(async()=>{
                message.react("💫");
                return message.reply(client.la[idioma]["comandos"]["dueño"]["keygen"]["variable2"]);
            });
            data.save();
            message.react("✅");
            return message.reply(client.la[idioma]["comandos"]["dueño"]["keygen"]["variable3"])
        }else{
            return message.reply(client.la[idioma]["comandos"]["dueño"]["keygen"]["variable4"])
        }
    }
}

function generar_clave(){
    //CLAVE: XXXX-XXXX-XXXX-XXXX
    let posibilidades = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let parte1 = "";
    let parte2 = "";
    let parte3 = "";
    let parte4 = "";
    for(let i=0; i<4; i++){
        parte1 += posibilidades.charAt(Math.floor(Math.random()*posibilidades.length));
        parte2 += posibilidades.charAt(Math.floor(Math.random()*posibilidades.length));
        parte3 += posibilidades.charAt(Math.floor(Math.random()*posibilidades.length));
        parte4 += posibilidades.charAt(Math.floor(Math.random()*posibilidades.length));
    }
    //devolvemos la clave generada, por ej: AB4S-JG35-SF4G-23J5
    return `${parte1}-${parte2}-${parte3}-${parte4}`
}