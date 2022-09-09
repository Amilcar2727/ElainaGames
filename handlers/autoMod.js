const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`);
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
const Discord = require("discord.js");

module.exports = client => {
    client.on("messageCreate", async message => {
        if(message.channel.type === "DM" && message.author.id !== '953575359041929236') {
            let contenido = message.content || "- No dijo nada -";
            let url = (message.attachments.first()===undefined)?undefined:message.attachments.first().url;
            let sticker = "";
            if(message.stickers.first()!==undefined) sticker = message.stickers.first().name;
            const DMembed = new Discord.MessageEmbed()
                .setAuthor({name: `Nuevo MD de ${message.author.tag}`,iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})
                .setDescription(`**ID Autor:** \`${message.author.id}\`\n**Sticker:** ${sticker}\n**Mensaje:**\n${contenido}`)
                .setColor("RANDOM")
                .setTimestamp();
            if(url!==undefined){
                return client.channels.cache.get('997548059527479457').send({content: `${url}`,embeds: [DMembed]})
            }else{
                return client.channels.cache.get('997548059527479457').send({embeds: [DMembed]})
            }
        }
        
        try {    
            if (!message.guild || !message.channel) return;
            // PROTECCION A ELAINA CONTRA NEKOTINA
            // --- COMANDOS PERSONAJE --- 
            let tagsP = ["majo_no_tabitabi","(majo_no_tabitabi)", "elaina"]
            let comandos = ["n!danbooru","n!db","n!gelbooru","n!gb","n!konachan","n!lew","n!rule34","n!r34"]
            let comandosD = ["n!anal","n!fuck","n!handjob","n!kuni","n!pussy","n!suckboobs","n!boobjob","n!happyend","n!yurifuck","n!fap","n!grabboobs","n!cum","n!footjob","n!grabbutts","n!suck"]
            let ids = ["953575359041929236"]

            let et = false;
            let ec = false;
            let ecd = false;
            let eid = false;
            //Comandos personaje
            for (var i in tagsP){
                if(message.content.toLowerCase().endsWith(tagsP[i])){
                  et = true;
                }
            }
            for (var j in comandos){
                if(message.content.toLowerCase().startsWith(comandos[j])){
                  ec = true;
                }
            }
            //Comandos bot - Directos
            for (var k in comandosD){
                if(message.content.toLowerCase().startsWith(comandosD[k])){
                  ecd = true;
                }
            }
            for (var l in ids){
                if(message.content.includes(ids[l])){
                  eid = true;
                }
            }
            if((et && ec) || (ecd && eid)){
                const filter = m => m.author.id === "429457053791158281";
                message.channel.awaitMessages({ filter, max: 1, time: 5000, errors: ['time'] })
                    .then(collected => {
                        message.member.timeout(10*60*1000, "Ha tratado de pasarse de listo conmigo 😠").catch(() => {console.log(`No he podido mutear1 al usuario ${message.author.id}`)});
                        collected.first().delete()
                    })
                    .catch(err => {console.log(err)});
            }
            else if(ecd){
                const filter = m => m.author.id === "429457053791158281";
                message.channel.awaitMessages({ filter, max: 1, time: 5000, errors: ['time'] })
                    .then(collected => {
                        if(collected.first().embeds.map(a=>a.description).toString().includes("ElainaNew")){
                            collected.first().delete()
                            message.member.timeout(10*60*1000, "Ha tratado de pasarse de listo conmigo 😠").catch(() => {console.log(`No he podido mutear2 al usuario ${message.author.id}`)});
                        }
                    })
                    .catch(err => {console.log(err)});
            }
            // COMPROBACION DE BOT Y FILTRADO POR SERVIDOR
            if (message.author.bot) return;
            let setups_data = await setupSchema.findOne({ guildID: message.guild.id });
            if (setups_data == null) return;
            //ANTIDISCORD
            if (setups_data.antiDiscord == true) {
                if (message.content.startsWith("https://discord.gg")) {
                    if (message.channel.id === "922177102940340224" ||//ALIANZAS 
                        message.channel.id === "962011866903748618" ||
                        message.channel.id === "960932997517951066" ||
                        message.channel.id === "959482043962638436" ||
                        message.channel.id === "973737853848784958" ||//socios
                        message.channel.id === "980270919744385044" ||
                        message.channel.id === "980910486302371860" ||
                        message.channel.id === "981719714826973214" ||
                        message.channel.id === "982822530500952094" ||
                        message.channel.id === "991795707314974741" ||
                        message.channel.id === "995061763563327608" ||
                        message.channel.id === "996226223925633075") {
                        await message.delete().catch(() => {});
                        return;
                    } else {
                        await message.delete().catch(() => { });
                        let role = await message.guild.roles.cache.find((r) => r.name === "Muteado por Elaina");
                        if (!role) {
                            role = await message.guild.roles.create({
                                name: "Muteado por Elaina",
                                permissions: ["VIEW_CHANNEL"],
                                mentionable: false,
                            });
                        }
                        await message.member.roles.add(role).catch((e) => { });
                        await message.guild.channels.cache.forEach((ch) => {
                            ch.permissionOverwrites.edit(role, {
                                SEND_MESSAGES: false,
                                CONNECT: false,
                                SPEAK: false,
                            });
                        });
                        return message.channel.send(`💫| ${message.author}, fuiste muteado por mandar un link de Discord!`);
                    }
                }
            }
            //ANTILINKS
            if (setups_data.antilinks === true) {
                let antilinkregex = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
                if ((antilinkregex.test(message) === true) || (message.content.startsWith("bit.ly"))) {
                    await message.delete().catch((e) => { });
                    let role = await message.guild.roles.cache.find((r) => r.name === "Muteado por Elaina");
                    if (!role) {
                        role = await message.guild.roles.create({
                            name: "Muteado por Elaina",
                            permissions: ["VIEW_CHANNEL"],
                            mentionable: false,
                        });
                    }
                    await message.member.roles.add(role).catch((e) => { });
                    await message.guild.channels.cache.forEach((ch) => {
                        ch.permissionOverwrites.edit(role, {
                            SEND_MESSAGES: false,
                            CONNECT: false,
                            SPEAK: false,
                        });
                    });
                    return message.channel.send(`💫| ${message.author}, fuiste muteado por mandar un link!`);
                }
            }
            //MINIATURAS
            let miniaturasB = ["sabe", "no", "oygan", "oigan", "gente", "y","donde", "puedo", "vine", "bine", "vengo por", "imagen", "veengo por", "dónde", "estan", "están", "como", "cómo", "encuentro", "encontrar", "encontrarlas", "alguien", "no", "canal", "?", "esperando"]
            let encontrado2 = false;
            var a = 0;
            let mensage = message.content.toLowerCase().replace(/\s+/g, "");
            for (var i in miniaturasB) {
                if (mensage.includes(miniaturasB[i])) {
                    a++;
                    encontrado2 = true;
                }
            }
            if (encontrado2 === true && a >= 2) {
                if (message.content.includes("las miniaturas") || message.content.includes("la miniatura")) {
                    a = 0;
                    message.reply({
                        embeds: [new Discord.MessageEmbed()
                            .setTitle("🔞 Info de las miniaturas")
                            .addField(`Para las miniaturas:`, `\n1.- Debes ir al canal de <#887504832435482674>.\n2.- Ahi reacciona al rol de <PAJIN-😈> y tendras acceso a la categoria NSFW\n3.- En ahi dirigete al canal <#920176157096284170>`)
                            .setFooter({ text: "~ Mensaje automático con autoborrado ~ ElainaNew", iconURL: `${client.user.displayAvatarURL()}` })
                        ]
                    }).then(msg => setTimeout(() => { msg.delete(); }, 20000)).catch(() => { });
                }
            }



        } catch (e) { console.log(e) }
    })
}