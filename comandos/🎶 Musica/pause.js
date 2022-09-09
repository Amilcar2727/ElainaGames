module.exports = {
    name: "pause",
    aliases: ["pausa"],
    desc: "Sirve para pausar la canción actual",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES","CONNECT","SPEAK"],
    run: async(client,message,args,prefix,idioma) =>{
        
        //comprobaciones previas
        const queue = client.distube.getQueue(message);
        if(!queue) return message.reply(client.la[idioma]["comandos"]["musica"]["generico"]["variable1"])
        if(!message.member.voice?.channel) return message.reply(client.la[idioma]["comandos"]["musica"]["generico"]["variable2"]);
        if(message.guild.me.voice?.channel && message.member.voice?.channel.id != message.guild.me.voice?.channel.id) return message.reply(client.la[idioma]["comandos"]["musica"]["generico"]["variable3"]);
        if(queue.paused) return message.reply(client.la[idioma]["comandos"]["musica"]["pause"]["variable4"]);
        client.distube.pause(message);
        message.reply(client.la[idioma]["comandos"]["musica"]["pause"]["variable5"]);
    }
}