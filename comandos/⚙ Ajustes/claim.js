const serverSchema = require(`${process.cwd()}/modelos/servidor.js`)
const keySchema = require(`${process.cwd()}/modelos/clave.js`)
module.exports = {
    name: "claim",
    aliases: ["reclamar", "claim-key"], 
    desc: "Sirve para reclamar una Clave Premium",
    permisos: ["ADMINISTRATOR","MANAGE_CHANNELS","MANAGE_GUILD","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR","MANAGE_CHANNELS","MANAGE_GUILD","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"],
    run: async (client, message, args, prefix, idioma) => {
        const clave = await keySchema.findOne({clave: args[0]});
        if(clave) {

            if(clave.activado) {
                return message.reply(client.la[idioma]["comandos"]["ajustes"]["claim"]["variable1"]);
            } else {
                //cambiamos el estado de la clave a usada / activado
                clave.activado = true;
                clave.save();

                //activamos el premium en el servidor
                await serverSchema.findOneAndUpdate({guildID: message.guild.id}, {
                    premium: Math.round(Date.now() + Number(clave.duracion))
                });
                let aux = await serverSchema.findOne({guildID: message.guild.id})
                if(aux.premium === ""){
                    return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["claim"]["variable3"]))
                }else{
                    return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["claim"]["variable2"]))
                }
            }
        } else {
            return message.reply(client.la[idioma]["comandos"]["ajustes"]["claim"]["variable4"])
        }
    }
}