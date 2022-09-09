const { MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/config/config.json`);
const serverSchema = require(`${process.cwd()}/modelos/servidor.js`);
const afkSchema = require(`${process.cwd()}/modelos/afk.js`);
const { asegurar_todo } = require(`${process.cwd()}/handlers/funciones.js`);

module.exports = async (client, message) => {
    if (!message.guild || !message.channel || message.author.bot) return;
    await asegurar_todo(message.guild.id, message.author.id);
    let data = await serverSchema.findOne({ guildID: message.guild.id });
    const args = message.content.slice(data.prefijo.length).trim().split(/ +/g);
    const cmd = args.shift()?.toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(c => c.aliases && c.aliases.includes(cmd));
    //EVENTO AFK
    const checkAFK = await afkSchema.findOne({
        Guild: message.guild.id,
        User: message.author.id,
    });
    if (checkAFK) {
        if (message.content.startsWith(`${data.prefijo}afk`) && message.author.id === checkAFK.User){
            const reason = args.join(' ') || 'No dijo nada';
            checkAFK.Razon = reason;
            checkAFK.save();
            return message.channel.send({embeds: [new MessageEmbed()
                .setAuthor({name: `AFK - Actualizado`,iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})
                .setDescription(`**Razón:** \`${reason}\``)
                .setColor(client.color)
            ]});
        }
        let tiempo = Math.round((Date.now()-checkAFK.Date)/1000);
        let dias = Math.round(tiempo>86400?tiempo/86400:0);
        let horas = Math.round(tiempo>3600?tiempo/3600:0);
        tiempo%=3600;
        let minutos = Math.round(tiempo>60?tiempo/60:0);
        tiempo%=60;
        let segundos = Math.round(tiempo);
        let tiempoCompleto = '-';
        if(dias>0){
            tiempoCompleto = `${dias} dias`;
        }
        if(dias<=0 && horas>0){
            tiempoCompleto = `${horas} horas`;
        }
        if(dias<=0 && horas<=0 && minutos>0){
            tiempoCompleto = `${minutos} minutos`;
        }
        if(dias<=0 && horas<=0 && minutos<=0 && segundos>0){
            tiempoCompleto = `${segundos} segundos`;
        }
        const dataBorrada = new MessageEmbed()
            .setAuthor({name: `- AFK REMOVIDO -`,iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})
            .setDescription(`¡ Regresaste por fin **\`${message.author.username}\`** !\n**·** Estuviste **inactivo** durante \`${tiempoCompleto}\``)
            .setColor("RANDOM");
        checkAFK.delete();
        return message.reply({ embeds: [dataBorrada] });
    }
    const usuarioAFK = message.mentions.users.first();
    if (usuarioAFK) {
        const data = await afkSchema.findOne({ Guild: message.guild.id, User: usuarioAFK.id });
        if (data) {
            const embedrespuesta = new MessageEmbed()
                .setTitle(`${usuarioAFK.username} se encuentra afk.`)
                .setColor("RANDOM")
                .setDescription(`**Razón:** \`${data.Razon}\`\n**Tiempo:** <t:${Math.round(data.Date / 1000)}:R>`)
                .setFooter({ text: "~ Mensaje automático con autoborrado ~ ElainaNew", iconURL: `${client.user.displayAvatarURL()}` });
            return message.reply({ embeds: [embedrespuesta] }).then(msg => setTimeout(() => { msg.delete(); }, 10000)).catch(() => { });
        }
    }
    //
    if (!message.content.startsWith(data.prefijo)) return;
    if (command) {
        if (command.owner) {
            if (!config.ownerIDS.includes(message.author.id)) return message.reply(`💫 **! Solo mis creadores pueden ejecutar este comando !**\n**Dueños del bot: **${config.ownerIDS.map(ownerid => `<@${ownerid}>`)}`);
        }
        if (command.premium) {
            if (data.premium) {
                if (data.premium <= Date.now()) return message.reply("💫 **Tu suscripción premium ha expirado!**")
            } else {
                return message.reply("💫 **Este es un comando premium!**")
            }
        }
        if (command.permisos_bot) {
            if (!message.guild.me.permissions.has(command.permisos_bot)) return message.reply(`💫 **No tengo suficientes permisos para ejecutar este comando!**\nNecesito los siguientes permisos: ${command.permisos_bot.map(permiso => `\`${permiso}\``).join(", ")}`)
        }
        if (command.permisos) {
            if (!message.member.permissions.has(command.permisos)) return message.reply(`💫 **No tienes suficientes permisos para ejecutar este comando!**\nNecesitas los siguientes permisos: ${command.permisos.map(permiso => `\`${permiso}\``).join(", ")}`);
        }
        //ejecutar comando
        command.run(client, message, args, data.prefijo, data.idioma);
    } else {
        //opcional
        return message.reply("💫 **¡No he encontrado el comando que me has especificado!**");
    }
}