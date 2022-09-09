const {paginacion} = require(`${process.cwd()}/handlers/funciones.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const { asegurar_todo } = require(`${process.cwd()}/handlers/funciones.js`);
//definimos las medallas de los top 3 usuarios con más dinero
var medallas = {
    1: "🥇",
    2: "🥈",
    3: "🥉"
}

module.exports = {
    name: "leaderboard",
    aliases: ["lb", "top100", "top", "lb-economia", "ecolb", "top-eco"],
    desc: "Sirve para ver la latencia del Bot",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES"],
    run: async (client, message, args, prefix,idioma) => {
        await asegurar_todo(message.guild.id);
        const total = await ecoSchema.find();
        await message.guild.members.fetch();
        const ordenado = total.filter(member => message.guild.members.cache.get(member.userID)).sort((a, b) => Number((b.dinero+b.banco) - (a.dinero+a.banco)));
        const texto = ordenado.map((miembro, index) => `${medallas[index+1] ?? ""} \`${index+1}\` - <@${miembro.userID}> *\`${message.guild.members.cache.get(miembro.userID).user.tag}\`*\n** -> :coin: Totales: ${miembro.dinero + miembro.banco}**\n\n`)
        paginacion(client, message, texto, eval(client.la[idioma]["comandos"]["economia"]["leaderboard"]["variable1"]),7,false)
    }
}