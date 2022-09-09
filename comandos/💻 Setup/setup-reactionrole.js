const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);

module.exports = {
    name: "setup-reactionrole",
    aliases: ["setup-reactionroles", "setup-reaccionroles", "setup-reaccionrol", "setupreactionroles", "reactionrolessetup"],
    desc: "Sirve para ver la latencia del Bot",
    permisos: ["ADMINISTRATOR","MANAGE_CHANNELS","ADD_REACTIONS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR","MANAGE_CHANNELS","ADD_REACTIONS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS","MANAGE_ROLES"],
    run: async (client, message, args, prefix,idioma) => {
        var contador = 0;
        var finalizado = false;

        var objeto = {
            ID_MENSAJE: "",
            ID_CANAL: "",
            Parametros: []
        }

        emoji()
        async function emoji(){
            contador++;
            if(contador === 23) {
                return finalizar();
            }
            var parametros = {
                Emoji: "",
                Emojimsg: "",
                Rol: "",
                msg: "",
            };

            let preguntar = await message.reply({
                embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable1"]))
                .setDescription(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable2"])
                .setColor(client.color)
            ]
            });
            preguntar.awaitReactions({
                filter: (reaction, user) => {
                    return user.id === message.author.id && !finalizado;
                },
                max: 1,
                errors: ["time"],
                time: 180e3
            }).then(collected => {
                if(collected.first().emoji?.id && collected.first().emoji?.id.length > 2){
                    preguntar.delete();
                    parametros.Emoji = collected.first().emoji?.id;
                    if(collected.first().emoji?.animated){
                        parametros.Emojimsg = `<a:${collected.first().emoji?.name}:${collected.first().emoji.id}>`
                    } else {
                        parametros.Emojimsg = `<:${collected.first().emoji?.name}:${collected.first().emoji?.id}>`
                    }
                    return rol()
                } else if(collected.first().emoji.name){
                    preguntar.delete();
                    parametros.Emoji = collected.first().emoji.name;
                    parametros.Emojimsg = collected.first().emoji.name;
                    return rol();
                } else {
                    message.reply(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable3"])
                    return finalizar();
                }
            }).catch(() => {
                ///Para posible falla
            });

            preguntar.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                errors: ["time"],
                time: 180e3
            }).then(collected => {
                if(collected.first().content.toLowerCase() === "finalizar" && !finalizado){
                    finalizado = true;
                    return finalizar();
                }
            }).catch(() => {
                return finalizar();
            });

            async function rol(){
                let querol = await message.reply({
                    embeds: [new Discord.MessageEmbed()
                    .setTitle(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable4"])
                    .setDescription(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable5"])
                    .setColor(client.color)
                    ]
                });
                await querol.channel.awaitMessages({
                    filter: m => m.author.id === message.author.id,
                    max: 1,
                    errors: ["time"],
                    time: 180e3
                }).then(async collected => {
                    var message = collected.first();
                    const rol = message.guild.roles.cache.get(message.content) || message.mentions.roles.first();
                    if(rol) {
                        parametros.Rol = rol.id;
                        objeto.Parametros.push(parametros);

                        querol.delete().catch(() => {});

                        return emoji();
                    } else {
                        return message.reply(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable6"])
                    }
                }).catch(() => {
                    return finalizar();
                })
            }
        }

        async function finalizar() {
            if(contador === 1 && !objeto.Parametros.length) return message.reply(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable7"]);
            let msg = await message.reply({ ///PRIMERO Q SALE
                embeds: [new Discord.MessageEmbed()
                .setTitle(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable8"])
                .setDescription(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable9"])
                .setColor(client.color)
                ]
            })
            await msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                errors: ["time"],
                time: 180e3,
            }).then(async collected => {
                var message = collected.first();
                const canal = message.guild.channels.cache.get(message.content) || message.mentions.channels.first();
                if(canal) {
                    objeto.ID_CANAL = canal.id

                    var idmensaje = await message.reply({
                        embeds: [new Discord.MessageEmbed()
                            .setTitle(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable10"])
                            .setDescription(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable11"])
                            .setColor(client.color)
                        ]
                    });
                    await idmensaje.channel.awaitMessages({
                        filter: m => m.author.id === message.author.id,
                        max: 1,
                        errors: ["time"],
                        time: 180e3,
                    }).then(async collected => {
                        var message = collected.first();
                        const encontrado = await message.guild.channels.cache.get(objeto.ID_CANAL).messages.fetch(message.content);
                        if(encontrado){
                            for(var i = 0; i < objeto.Parametros.length; i++){
                                encontrado.react(objeto.Parametros[i].Emoji).catch(() => {console.log("NO SE HA PODIDO AÑADIR LA REACCIÓN")})
                            }
                            objeto.ID_MENSAJE = message.content;
                            let setupdatos = await setupSchema.findOne({guildID: message.guild.id});
                            setupdatos.reaccion_roles.push(objeto);
                            setupdatos.save();
                            return message.reply({embeds: [new Discord.MessageEmbed()
                                .setTitle(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable12"])
                                .setDescription(eval(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable12.1"]))
                                .setColor("RANDOM")
                                .setTimestamp()
                            ]})
                        } else {
                            return message.reply(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable13"])
                        }
                    }).catch(() => {
                        return message.reply(client.la[idioma]["comandos"]["setup"]["reactionrole"]["tiempo"])
                    })
                } else {
                    return message.reply(client.la[idioma]["comandos"]["setup"]["reactionrole"]["variable14"])
                }
            }).catch(() => {
                return message.reply(client.la[idioma]["comandos"]["setup"]["reactionrole"]["tiempo"])
            })
        }
    }
}
