module.exports = {
    name: "resume",
    aliases: ["despausar","unpause","reanudar","resumen"],
    desc: "Sirve para despausar la canción actual",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES","CONNECT","SPEAK"],
    run: async(client,message,args,prefix,idioma) =>{
        //comprobaciones previas
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) return message.reply("💫 Debes estar en un canal de voz para usar este comando");
        if(message.guild.me.voice.channelId && voiceChannel.id !== message.guild.me.voice.channelId) return message.reply(`Ya estoy en otro canal: ${message.guild.me.voice.channel}, debes estar en el mismo canal`);
        try {
            const queue = await client.distube.getQueue(message);
            if(!queue) return message.reply(client.la[idioma]["comandos"]["musica"]["generico"]["variable1"]);

            await queue.resume(voiceChannel);
            return message.reply("Musica reanudada");

        } catch (err) {
            return console.log(err);
        }
    }
}