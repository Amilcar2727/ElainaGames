const schema = require(`${process.cwd()}/modelos/servidor.js`)
const fs = require('fs');
module.exports = {
    name: "set-language",
    aliases: ["set-lang","setlanguage", "setlang","change-lang","changelanguage","changelang","lang","language","idioma","cambiar-idioma"],
    desc: "Sirve para configurar el lenguaje que tendré en el servidor!",
    permisos: ["ADMINISTRATOR","MANAGE_CHANNELS","MANAGE_GUILD","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR","MANAGE_CHANNELS","MANAGE_GUILD","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"],
    premium: true,
    run: async(client,message,args,prefix,idioma) =>{
        const data = await schema.findOne({guildID: message.guild.id});
        let idiomas = fs.readdirSync(`./idiomas`).filter(archivo=>archivo.endsWith(".json")).map(archivo=>archivo.replace(/.json/,""));

        if(!args[0]) return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["set-language"]["variable1"]));
        if(!idiomas.includes(args[0])) return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["set-language"]["variable2"]));
        if(data.idioma == args[0]) return message.reply(client.la[idioma]["comandos"]["ajustes"]["set-language"]["variable3"]);
        data.idioma = args[0];
        data.save();
        return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["set-language"]["variable4"]));
    }
}