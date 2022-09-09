const Discord = require("discord.js");
const day = require("dayjs");
module.exports = {
    name: "userinfo",
    aliases: [],
    desc: "Sirve para ver info de un usuario xd",
    owner: true,
    run: async (client, message, args, prefix, idioma) => {

        // Ponemos los estados
        let estados = {
            "online": "Conectado",
            "idle": "Ausente",
            "dnd": "No molestar",
            "offline": "Desconectado/Invisible"
        };
        // usuario mencionado y si no el autor del mensaje
        let usuario = await (
            message.mentions.users.first() || message.author
        ).fetch();

        const member = await message.guild.members.fetch(usuario);

        const joinsv = day(usuario.joinedAt).format('DD/MM/YY');
        const joinds = day(usuario.createdAt).format('DD/MM/YY');
        // Creamos embed 
        const embedInfo = new Discord.MessageEmbed()

            .setTitle(`Información de ${usuario.username}`)
            .addField('**Nombre :**', `${usuario.username}`)
            .addField('**Tag**', `#${usuario.discriminator}`)
            .addField('**ID :**', `${usuario.id}`)
            .addField('**Apodo :**', `${member.nickname !== null ? `${member.nickname}` : 'ninguno'}`)
            .addField('**Booster :**', usuario.premiumSince ? 'Usuario Booster' : 'Usuario No Booster')
            .addField('**Fecha de creación de cuenta :**', `${joinds}`)
            .addField('**Se unio al servidor :**', `${joinsv}`)
            .addField('**¿Es un bot? :**', usuario.bot ? 'Si' : 'No')
            .addField('**Estado :**', estados[member.presence?.status ?? 'offline'])
            .setThumbnail(usuario.displayAvatarURL({ format: 'png', dynamic: 'true' }))
            .setColor("BLUE")
        // Envianos embed 
        return message.channel.send({ embeds: [embedInfo] });

    }
}