const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
const { asegurar_todo } = require(`${process.cwd()}/handlers/funciones.js`);

module.exports = client => {
    client.on("guildMemberAdd", async member => {
        try {
            const setupData = await setupSchema.findOneAndUpdate({ guildID: member.guild.id });
            if (!setupData) return;
            if (setupData.miniaturas) {
                const miniaturaEmbed = new Discord.MessageEmbed()
                    .setTitle("🔞 Info de las miniaturas")
                    .addField(`¡ Bienvenido a『Dark's Community』!`, `**Por si viene sólo por las miniaturas:**\n1.- Debes ir al canal de <#887504832435482674>.\n2.- Ahi reacciona al rol de <PAJIN-😈> y tendras acceso a la **categoria NSFW**\n3.- En ahi dirigete al canal <#920176157096284170>`)
                    .setFooter({ text: "No responder - Mensaje automático ~ ElainaNew", iconURL: `${client.user.displayAvatarURL()}` })
                    .setTimestamp();
                member.send({embeds: [miniaturaEmbed]}).catch(() => {});
            }

            //BIENVENIDAS
            if (!setupData.bienvenida || !member.guild.channels.cache.get(setupData.bienvenida.canal)) {
                return;
            } else {
                const mensaje = setupData.bienvenida.mensaje.toString()
                    .replace(/{user}/, member.user)
                    .replace(/{usertag}/, member.user.tag)
                    .replace(/{username}/, member.user.username)
                    .replace(/{servername}/, member.guild.name);
                member.guild.channels.cache.get(setupData.bienvenida.canal).send({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle("BIENVENIDO!")
                        .setDescription(mensaje)
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                        .setImage(setupData.bienvenida.imagen)
                        .setColor(client.color)
                        .setFooter({ text: "━━━━━━━ • ஜ • ❈ • ஜ • ━━━━━━━", iconURL: `${client.user.displayAvatarURL()}` })
                        .setTimestamp()
                    ],
                })
            };

        } catch (e) { console.log(e) }
    })
}