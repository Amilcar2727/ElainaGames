const { VoiceChannel } = require("discord.js");

module.exports = {
    name: "volume",
    aliases: ["vol","volumen"],
    desc: "Sirve para modular el volumen de la musica",
    owner: true,
    run: async (client, message, args, prefix) => {
        //comprobaciones previas
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) return message.reply("💫 Debes estar en un canal de voz para usar este comando");
        if(message.guild.me.voice.channelId && voiceChannel.id !== message.guild.me.voice.channelId) return message.reply(`Ya estoy en otro canal: ${message.guild.me.voice.channel}, debes estar en el mismo canal`);
       
        let volume = args[0];
        if(!volume || isNaN(volume)) return message.reply("💫 Debes un numero valido para el volumen del bot");
        if(volume > 100 || volume < 1) return message.reply("💫 El volumen debe estar entre 1 y 100");
        try {
            client.distube.setVolume(voiceChannel,volume);
            message.reply(`El volumen ahora está en \`${volume}%\``);

        } catch (err) {
            return console.log(err);
        }
        
    }
}