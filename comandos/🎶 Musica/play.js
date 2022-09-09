module.exports = {
    name: "play",
    aliases: ["reproducir", "p"],
    desc: "Sirve para reproducir una canción",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES","CONNECT","SPEAK"],
    //owner: true,
    run: async(client,message,args,prefix,idioma) =>{
        //comprobaciones previas
        if(!args.length) return message.reply(client.la[idioma]["comandos"]["musica"]["play"]["variable4"]);
        if(!message.member.voice?.channel) return message.reply(client.la[idioma]["comandos"]["musica"]["generico"]["variable2"]);
        if(message.guild.me.voice?.channel && message.member.voice?.channel.id != message.guild.me.voice?.channel.id) return message.reply(client.la[idioma]["comandos"]["musica"]["generico"]["variable3"]);
        client.distube.play(message.member.voice?.channel, args.join(" "),{
            member: message.member,
            textChannel: message.channel,
            message
        })
        message.reply(eval(client.la[idioma]["comandos"]["musica"]["play"]["variable5"]));
    }
}