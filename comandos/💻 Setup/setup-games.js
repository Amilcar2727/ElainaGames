const Discord = require('discord.js');
const gamesSchema = require(`${process.cwd()}/modelos/games.js`);
module.exports = {
    name: "setup-games",
    aliases: ["set-game", "setupgames", "setgames", "setupgame", "setgame"],
    desc: "Sirve para configurar el sistema de juegos",
    permisos: ["ADMINISTRATOR", "MANAGE_CHANNELS", "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR", "MANAGE_CHANNELS", "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"],
    run: async (client, message, args, prefix) => {
        let uso = `\n**Uso:** \`${prefix}setup-games <CANAL-NORMAL> [CANAL-NSFW]\``
        if (!args.length) return message.reply({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`💫 ¡ Debes de especificar los Canales para las Categorias !`)
                .setDescription(uso)
                .setColor("RANDOM")
                .setTimestamp()
            ]
        })
        const canalNormal = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
        if (!canalNormal) return message.reply("💫 No has especificado un **canal valido** para los **Juegos** !");

        let canalNsfw = message.guild.channels.cache.get(args[1]) || message.mentions.channels.at(1);
        if (!canalNsfw) canalNsfw = "";

        let gamesdata = await gamesSchema.findOne({ guildID: message.guild.id });
        if (!gamesdata) {
            gamesdata = await new gamesSchema({
                guildID: message.guild.id
            });
            await gamesdata.save();
        }
        gamesdata.canalID = canalNormal.id;
        gamesdata.canalNsfw = (canalNsfw !== "") ? canalNsfw.id : "";
        gamesdata.activado = true;
        //Agregamos Juegos
        let juegos = [
            { name: "Chivo", desc: "Maneja un chivo xd.", category: "safe", id: "000"},
            { name: "Aronow", desc: "Ni idea x2 xd.", category: "safe", id: "001"},
            { name: "Miss Maths", desc: "Resuelve mates mientras la profesora te motiva.", category: "nsfw", id: "002" },
            { name: "Checkit", desc: "Ni idea xd.", category: "nsfw", id: "003" }
        ]
        //Los agregamos a la base de datos
        gamesdata.juegos = [];
        juegos.forEach(element => {
            if(canalNsfw!==""){ //nsfw activado
                gamesdata.juegos.push(element);
            }else{
                if(element.category!=="nsfw"){
                    gamesdata.juegos.push(element);
                }
            }
        });
        //Salvamos los cambios
        gamesdata.save();
        let nombres = gamesdata.juegos.map((juego)=>`${juego.name}`).join(", ");
        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: " - ENTRETENIMIENTO -", iconURL: client.user.displayAvatarURL() })
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter({ text: `~ Todas las interraciones serán solo en los canales especificados ~ ElainaNew` })
            .addField("Juegos Agregados:",nombres);
        if (gamesdata.canalNsfw !== "") {
            embed.setDescription(`🎆 | Establecido en el canal <#${canalNormal.id}> el sistema de juegos !\n\`Categoria NSFW:\` <#${canalNsfw.id}>`);
            embed.setThumbnail(`https://i.pinimg.com/originals/dc/c7/61/dcc761ef36cabba1405bd460477aebc5.jpg`);
        } else {
            embed.setDescription(`🎆 | Establecido en el canal <#${canalNormal.id}> el sistema de juegos !`);
            embed.setThumbnail(`https://i.pinimg.com/originals/c2/e4/c4/c2e4c4c1336a13ba694af93c4776ed97.jpg`);
        }
        return message.reply({ embeds: [embed] });
    }
}