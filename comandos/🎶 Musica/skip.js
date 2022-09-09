module.exports = {
    name: "skip",
    aliases: ["saltar","next"],
    desc: "Sirve para saltar una canción",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES","CONNECT","SPEAK"],
    run: async(client,message,args,prefix,idioma) =>{
        //comprobaciones previas
        const queue = client.distube.getQueue(message);
        if(!queue) return message.reply(client.la[idioma]["comandos"]["musica"]["generico"]["variable1"])
        if(!message.member.voice?.channel) return message.reply(client.la[idioma]["comandos"]["musica"]["generico"]["variable2"]);
        if(message.guild.me.voice?.channel && message.member.voice?.channel.id != message.guild.me.voice?.channel.id) return message.reply(client.la[idioma]["comandos"]["musica"]["generico"]["variable3"]);
        if(!queue.autoplay && queue.songs.length <= 1) return message.reply(client.la[idioma]["comandos"]["musica"]["skip"]["variable4"])
        client.distube.skip(message);
        message.reply(client.la[idioma]["comandos"]["musica"]["skip"]["variable5"]);
    }
}