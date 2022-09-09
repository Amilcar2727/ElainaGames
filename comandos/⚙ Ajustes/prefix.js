const schema = require(`${process.cwd()}/modelos/servidor.js`)

module.exports = {
    name: "prefix",
    aliases: ["setprefix","set-prefix","prefijo", "cambiarprefijo", "cambiarprefix"],
    desc: "Sirve para cambiar el Prefijo del Bot en el Servidor",
    permisos: ["ADMINISTRATOR","MANAGE_CHANNELS","MANAGE_GUILD","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"],
    run: async (client, message, args, prefix, idioma) => {
        let tilin = [/<?a:[\w\d]+:\d{17,20}>/]
        if(!args[0]) return message.reply(client.la[idioma]["comandos"]["ajustes"]["prefix"]["variable1"]);
        if (/\p{Emoji}/gu.test(args[0])) return message.reply(client.la[idioma]["comandos"]["ajustes"]["prefix"]["variable2"]);
        if (args[0].match(tilin)) return message.reply(client.la[idioma]["comandos"]["ajustes"]["prefix"]["variable2"]);
        if(args[0] === prefix) return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["prefix"]["variable3"]));
        await schema.findOneAndUpdate({guildID: message.guild.id}, {
            prefijo: args[0]
        })
        return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["prefix"]["variable4"]))
    }
}