module.exports = {
    name: "clear",
    aliases: ["cl", "delete", "borrar", "eliminar", "purge"],
    desc: "Sirve para ver eliminar mensajes en un canal de texto",
    permisos: ["ADMINISTRATOR", "MANAGE_MESSAGES", "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES"],
    permisos_bot: ["MANAGE_MESSAGES", "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES"],
    run: async (client, message, args, prefix,idioma) => {
        const cantidad = parseInt(args[0])
        if (!cantidad) return message.channel.send(client.la[idioma]["comandos"]["moderacion"]["clear"]["variable1"]);
        if (isNaN(cantidad) || cantidad <=0) return message.channel.send(client.la[idioma]["comandos"]["moderacion"]["clear"]["variable2"]);
        if (cantidad > 100) return;
        if(message.author.id !== "630397589832990730" && cantidad > 13) return message.reply(client.la[idioma]["comandos"]["moderacion"]["clear"]["variable3"]);
        try {
            setTimeout(() => message.channel.bulkDelete(cantidad+1,true), 1000)
          } catch {
            param.reply(client.la[idioma]["comandos"]["moderacion"]["clear"]["variable4"])
          }
    }
}