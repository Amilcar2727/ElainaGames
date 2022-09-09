const Discord = require('discord.js');
const gamesSchema = require(`${process.cwd()}/modelos/games.js`);
const playingSchema = require(`${process.cwd()}/modelos/playing.js`);

function replaceIndexAt(text, index, replacement) {
    if (index >= text.length) {
        return text.valueOf();
    }
    var chars = text.split('');
    chars[index] = replacement;
    return chars.join('');
}

module.exports = {
    name: "game",
    aliases: ["startgame", "start", "startg", "sg"],
    desc: "Empieza a jugar el juego que especifiques",
    permisos: ["VIEW_CHANNEL", "SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL", "SEND_MESSAGES"],
    run: async (client, message, args, prefix, idioma) => {

        //Asegurar la BD
        let gamesdata = await gamesSchema.findOne({ guildID: message.guild.id });
        if (!gamesdata) return message.reply(`💫 El sistema de entretenimiento **no está activado** en el servidor\n**¡ Los admins deben usar: \`${prefix}setup-games\` para activarlo !**`);
        //Comprobar que el usuario no esté "jugando"
        let playing = await playingSchema.findOne({ playerID: message.author.id });
        if (playing) {
            playing.delete();
            return message.reply("💫 **¡ Ya estabas jugando hace poco !**\nVuelve a introducir el comando");
        }
        //Comprobamos el canal en el que se ejecutó
        if (gamesdata.canalNsfw !== "") {//NSFW Habilitado
            if (gamesdata.canalID !== message.channel.id && gamesdata.canalNsfw !== message.channel.id) return message.reply(`💫 Este comando sólo es valido en <#${gamesdata.canalID}> o <#${gamesdata.canalNsfw}>`);
        } else {
            if (gamesdata.canalID !== message.channel.id) return message.reply(`💫 Este comando sólo es valido en <#${gamesdata.canalID}>`);
        }
        //Comprobamos la categoria nsfw y damos el help
        let uso = `\n**Uso:** \`${prefix}game <ID-GAME>\``;
        //let texto = gamesdata.juegos.map((juego)=>`⁘**${juego.name.toUpperCase()}**⁘\n**Descripción:** ${juego.desc}\n**Categoria:** ${juego.category}\n**Id:** \`${juego.id}\`\n`).join("\n");
        let info = new Discord.MessageEmbed()
            .setTitle(`🎮 - ENTRETENIMIENTO - 🕹`)
            .addField("『INFO-JUEGOS』", `Para poder acceder a un juego debes escribir su id despues del comando.${uso}\n\n\t**·『JUEGOS HABILITADOS』·**`)
            .setColor("BLURPLE");
        let numeroJuegos = gamesdata.juegos.length;
        for (let index = 0; index < numeroJuegos; index++) {
            juego = gamesdata.juegos[index];
            info.addField(`⁘**${juego.name.toUpperCase()}**⁘`, `\`\`\`js\n💫Tipo: ${juego.category}\nID: ${juego.id}\nDescription:\n${juego.desc}\n\`\`\``, true);
        }
        if (gamesdata.canalNsfw !== "") { //NSFW habilitado
            info.setThumbnail("https://i.pinimg.com/originals/1b/57/72/1b5772a1f4a0fa72e275684edb4e660b.jpg");
        } else {
            info.setThumbnail("https://i.pinimg.com/564x/4d/0f/5d/4d0f5d0478a8484d63350b5525b93fb1.jpg");
        }
        if (!args.length) return message.reply({ embeds: [info] })

        //El usuario ejecutó el comando
        //Escogió un juego mediante id
        const idGame = args[0];
        //Comprobar si es un juego nsfw o normal
        let existe = false;
        let esNSFW = false;
        let nombre = "";
        gamesdata.juegos.forEach(element => {
            if (element.id === idGame) {
                existe = true; //Comprobar si existe el juego
                nombre = element.name;
                if (element.category === "nsfw") {
                    esNSFW = true;
                }
            }
        });
        //Si no existe el juego
        if (existe === false) return message.reply("💫 No pude encontrar el juego con el **id especificado.**");
        //Comprobar si es un canal nsfw donde se ejecutó el comando
        if (esNSFW) { //Es un juego nsfw
            if (message.channel.id !== gamesdata.canalNsfw) {
                return message.reply(`🔞 Este es un juego solo valido para <#${gamesdata.canalNsfw}>`);
            }
        }
        //creamos el objeto del nuevo jugador
        //leer el juego y el usuario, y meterlo a la base de datos
        let newPlayer = await new playingSchema({
            playerID: message.author.id,
            juegoID: idGame,
            juegoName: nombre
        });
        await newPlayer.save();
        let embedInfo = new Discord.MessageEmbed()
            .setAuthor({ name: `Ahora mismo jugando:`, iconURL: `${message.author.displayAvatarURL()}` })
            .setTitle(`${nombre.toUpperCase()}`)
            .setTimestamp();
        //HACEMOS COSAS DEPENDE AL ID DEL JUEGO
        switch (idGame) {
            case "000": //JUEGO DEL CHIVO XD
                embedInfo.addField("¿Cómo jugar?", `Desplazate usando los botones`);
                embedInfo.setThumbnail("https://steemitimages.com/DQmR45QSeHMpzEeCWRBs6xi9VDe7ZpFXvSibmhoMnrtEnD8/chivo.jpg");
                message.reply({
                    embeds: [embedInfo]
                });
                let texto = `⍢___🐐______________________________ł`;
                let boton_atras = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('izquierda').setEmoji('◀').setLabel('Izquierda');
                let boton_salir = new Discord.MessageButton().setStyle('SECONDARY').setCustomId('salir').setEmoji('❌').setLabel('Salir');
                let boton_avanzar = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('derecha').setEmoji('▶').setLabel('Derecha');
                const msg = await message.guild.channels.cache.get(message.channel.id).send({
                    content: `\`\`\`${texto}\`\`\``,
                    components: [new Discord.MessageActionRow().addComponents([boton_atras, boton_salir, boton_avanzar])]
                });
                newPlayer.mensaje = msg.id;
                newPlayer.save();
                console.log(texto);
                console.log(`Longitud: ${texto.length}`);
                let chivoPos = texto.indexOf("🐐");
                console.log(`chivoPos1: ${chivoPos}`);
                console.log(`chivoPos2: ${chivoPos + 1}`);
                return movimiento(msg, texto);

            case "001":
                break;
            default:
                break;
        }

        async function movimiento(msg, texto) {
            //Creamos un collector y filtramos que la persona que haga click al botón, sea la misma que ha puesto el comando, y que el autor del mensaje de las páginas, sea el cliente
            const collector = msg.createMessageComponentCollector({ filter: i => i?.isButton() && i?.user && i?.message.author.id == client.user.id, time: 180e3 });
            //Escuchamos los eventos del collector
            collector.on("collect", async b => {
                if (b?.user.id !== message.author.id) return;
                let chivoPos = texto.indexOf("🐐");
                switch (b?.customId) {
                    case "izquierda": {
                        //Resetemamos el tiempo del collector
                        collector.resetTimer();
                        console.log("Retrocede");
                        //Movimiento en si
                        let sgtePos = chivoPos - 3;
                        let sgtePos2 = chivoPos - 2;
                        let sgte = texto[sgtePos];
                        let sgte2 = texto[sgtePos2];
                        if (sgte === "_" && sgte2 === "_") {
                            texto = replaceIndexAt(texto, sgtePos, "🐐");

                        } else {
                            texto = replaceIndexAt(texto, -1, "🐐");
                        }
                        texto = replaceIndexAt(texto, chivoPos + 1, "_");
                        texto = replaceIndexAt(texto, chivoPos + 2, "_");
                        if (texto[36] !== "🐐") {
                            texto = replaceIndexAt(texto, 36, "");
                        }
                        console.log(`Longitud: ${texto.length}`);
                        console.log(`chivoPos1: ${sgtePos}`);
                        console.log(`chivoPos2: ${sgtePos2}`);
                        console.log(`-> ${texto}`)
                        //Editamos el embeds
                        await msg.edit({ content: `\`\`\`${texto}\`\`\``, components: [msg.components[0]] }).catch(() => { });
                        //COMPROBACION DE MUERTE
                        if (texto.indexOf("🐐") <= 0) {
                            msg.components[0].components.map(boton => boton.disabled = true)
                            msg.edit({ content: `**¡ PERDISTE !**`, components: [msg.components[0]] }).catch(() => { });
                            await playingSchema.findOneAndDelete({ playerID: message.author.id });
                        }
                        await b?.deferUpdate();
                    }
                        break;

                    case "derecha": {
                        //Resetemamos el tiempo del collector
                        collector.resetTimer();
                        console.log("Avanza");
                        //Movimiento en si
                        let sgtePos = chivoPos + 2;
                        let sgtePos2 = chivoPos + 3;
                        let sgte = texto[sgtePos];
                        let sgte2 = texto[sgtePos2];
                        if (sgte === "_" && sgte2 === "_") {
                            texto = replaceIndexAt(texto, sgtePos, "🐐");
                            texto = replaceIndexAt(texto, chivoPos, sgte);
                            texto = replaceIndexAt(texto, chivoPos + 1, sgte2);
                            if (texto[1] !== "🐐") {
                                texto = replaceIndexAt(texto, 1, "");
                            }
                        }

                        console.log(`Longitud: ${texto.length}`);
                        console.log(`chivoPos1: ${sgtePos}`);
                        console.log(`chivoPos2: ${sgtePos2}`);
                        console.log(`-> ${texto}`)
                        await msg.edit({ content: `\`\`\`${texto}\`\`\``, components: [msg.components[0]] }).catch(() => { });
                        
                        //COMPROBACION DE MUERTE
                        if (texto.indexOf("🐐") <= 0) {
                            msg.components[0].components.map(boton => boton.disabled = true)
                            msg.edit({ content: `**¡ PERDISTE !**`, components: [msg.components[0]] }).catch(() => { });
                            await playingSchema.findOneAndDelete({ playerID: message.author.id });
                        }
                        await b?.deferUpdate();
                    }
                        break;
                    case "salir": {
                        console.log("Salió");
                        msg.components[0].components.map(boton => boton.disabled = true)
                        msg.edit({ content: `**Juego Cancelado.**`, components: [msg.components[0]] }).catch(() => { });
                        await playingSchema.findOneAndDelete({ playerID: message.author.id });
                        await b?.deferUpdate();
                    }
                        break;
                    default:
                        break;
                }
            });
            collector.on("end", async () => {
                //desactivamos los botones y editamos el mensaje
                msg.components[0].components.map(boton => boton.disabled = true)
                msg.edit({ content: `**¡ El tiempo expiró, juego cancelado.**`, components: [msg.components[0]] }).catch(() => { });
                await playingSchema.findOneAndDelete({ playerID: message.author.id });
            });
        }


    }
}