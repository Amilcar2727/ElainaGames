const {asegurar_todo} = require("./funciones");
const playingSchema = require(`${process.cwd()}/modelos/playing.js`);
const Discord = require("discord.js");
const html = require('discord-html-transcripts');

module.exports = client => {
    //BOTONES
    /*
    client.on("interactionCreate",async interaction =>{
        try{
            //comprobaciones previas
            if(!interaction.guild || !interaction.channel || !interaction.isButton() || interaction.message.author.id !== client.user.id ) return;
            //buscamos el setup en la base de datos
            let ticket_data = await ticketSchema.findOne({guildID: interaction.guild.id, canal: interaction.channel.id});
            switch(interaction.customId){
                case "cerrar_ticket":{
                    //si el ticket ya está cerrado, hacemos return;
                    if(ticket_data && ticket_data.cerrado) return interaction.reply({content: `💫 **Este ticket ya está cerrado!**`,ephemeral:true});
                    interaction.deferUpdate();
                    //creamos el mensaje de verificar
                    const verificar = await interaction.channel.send({
                        embeds: [new Discord.MessageEmbed()
                            .setTitle(`Verificate primero!`)
                            .setColor("GREEN")
                        ],
                        components: [new Discord.MessageActionRow().addComponents(
                            new Discord.MessageButton().setLabel("Verificarse").setStyle("SUCCESS").setCustomId("verificar").setEmoji("✅")
                        )]
                    });
                    //creamos el collector
                    const collector = verificar.createMessageComponentCollector({
                        filter: i=>i.isButton() && i.message.author.id == client.user.id && i.user,
                        time: 180e3,
                    });
                    //escuchamos clicks en el boton
                    collector.on("collect",boton=>{
                        //si la persona que hace click en el boton de verificarse NO es la misma persona que ha hecho click al boton de cerrar ticket, return;
                        if(boton.user.id !== interaction.user.id) return boton.reply({content: `💫 **No puedes hacer eso!, Solo ${interaction.user} puede!**`, ephemeral:true});
                        //paramos el colector
                        collector.stop();
                        boton.deferUpdate();
                        //cerramos el ticket en la base de datos
                        ticket_data.cerrado = true;
                        ticket_data.save();
                        //hacemos que el usuario que ha creado el ticket, no pueda ver el ticket
                        interaction.channel.permissionOverwrites.edit(ticket_data.autor,{VIEW_CHANNEL: false});
                        interaction.channel.send(`✅ **Ticket Cerrado por \`${interaction.user.tag}\` el <t:${Math.round(Date.now() / 1000)}>**`)
                    });
                    collector.on("end",(collected)=>{
                        //si el usuario ha hecho click al botón de verificar, editamos el mensaje desactivando el boton de verificar
                        if(collected && collected.first() && collected.first().customId){
                            //editamos el mensaje desactivado el boton de verificarse
                            verificar.edit({
                                components: [new Discord.MessageActionRow().addComponents(
                                    new Discord.MessageButton().setLabel("Verificarse").setStyle("SUCCESS").setCustomId("verificar").setEmoji("✅").setDisabled(true)
                                )]
                            })
                        }else{
                            verificar.edit({
                                embeds: [verificar.embeds[0].setColor("RED")],
                                components: [new Discord.MessageActionRow().addComponents(
                                    new Discord.MessageButton().setLabel("NO VERIFICADO").setStyle("DANGER").setCustomId("verificar").setEmoji("❌").setDisabled(true)
                                )]
                            })
                        }
                    })
                }
                break;
                    case "borrar_ticket":{
                        interaction.deferUpdate();
                        //creamos el mensaje de verificar
                        const verificar = await interaction.channel.send({
                            embeds: [new Discord.MessageEmbed()
                                .setTitle(`Verificate primero!`)
                                .setColor("GREEN")
                            ],
                            components: [new Discord.MessageActionRow().addComponents(
                                new Discord.MessageButton().setLabel("Verificarse").setStyle("SUCCESS").setCustomId("verificar").setEmoji("✅")
                            )]
                        });
                        //creamos el collector
                        const collector = verificar.createMessageComponentCollector({
                            filter: i=>i.isButton() && i.message.author.id == client.user.id && i.user,
                            time: 180e3,
                        });
                        //escuchamos clicks en el boton
                        collector.on("collect",boton=>{
                            //si la persona que hace click en el boton de verificarse NO es la misma persona que ha hecho click al boton de cerrar ticket, return;
                            if(boton.user.id !== interaction.user.id) return boton.reply({content: `💫 **No puedes hacer eso!, Solo ${interaction.user} puede!**`, ephemeral:true});
                            //paramos el colector
                            collector.stop();
                            boton.deferUpdate();
                            //borramos el ticket de la base de datos
                            ticket_data.delete();
                            interaction.channel.send(`✅ **El ticket será eliminado en menos de \`3 segundos ...\`\nAcción por: \`${interaction.user.tag}\` el <t:${Math.round(Date.now() / 1000)}>**`)
                            //borramos el canal en 3 segundos
                            setTimeout(()=>{
                                interaction.channel.delete();
                            },3_000);
                        });
                        collector.on("end",(collected)=>{
                            //si el usuario ha hecho click al botón de verificar, editamos el mensaje desactivando el boton de verificar
                            if(collected && collected.first() && collected.first().customId){
                                //editamos el mensaje desactivado el boton de verificarse
                                verificar.edit({
                                    components: [new Discord.MessageActionRow().addComponents(
                                        new Discord.MessageButton().setLabel("Verificarse").setStyle("SUCCESS").setCustomId("verificar").setEmoji("✅").setDisabled(true)
                                    )]
                                })
                            }else{
                                verificar.edit({
                                    embeds: [verificar.embeds[0].setColor("RED")],
                                    components: [new Discord.MessageActionRow().addComponents(
                                        new Discord.MessageButton().setLabel("NO VERIFICADO").setStyle("DANGER").setCustomId("verificar").setEmoji("❌").setDisabled(true)
                                    )]
                                })
                            }
                        })
                    }
                    break;

                    case "guardar_ticket":{
                        interaction.deferUpdate();
                        //enviamos el mensaje de guardando ticket
                        const mensaje = await interaction.channel.send({
                            content: interaction.user.toString(),
                            embeds: [new Discord.MessageEmbed()
                                .setTitle(`⌛ Guardando Ticket...`)
                                .setColor(client.color)
                            ]
                        });

                        //generamos el archivo html con la conversación
                        const adjunto = await html.createTranscript(interaction.channel,{
                            limit: -1,
                            returnBuffer: false,
                            fileName: `${interaction.channel.name}.html`
                        })
                        mensaje.edit({
                            embeds: [new Discord.MessageEmbed()
                                .setTitle(`🎆 **Ticket Guardado**`)
                                .setColor("GREEN")
                            ],
                            files: [adjunto]
                        })
                    } 
                    break;

                default:
                    break;
            }

        }catch(e){
            console.log(e);
        }
    })
    */
}
