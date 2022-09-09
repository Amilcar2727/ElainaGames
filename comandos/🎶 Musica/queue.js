const Discord = require('discord.js');
module.exports = {
    name: "queue",
    aliases: ["q", "cola"],
    desc: "Sirve para ver la lista de canciones",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES","EMBED_LINKS","CONNECT","SPEAK"],
    run: async (client, message, args, prefix,idioma) => {
        //comprobaciones previas
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply(client.la[idioma]["comandos"]["musica"]["generico"]["variable1"]);
        if (!message.member.voice?.channel) return message.reply(client.la[idioma]["comandos"]["musica"]["generico"]["variable2"]);
        if (message.guild.me.voice?.channel && message.member.voice?.channel.id != message.guild.me.voice?.channel.id) return message.reply(client.la[idioma]["comandos"]["musica"]["generico"]["variable3"]);

        let listaqueue = []; //creamos un array vacío donde se introducirán todas las canciones
        var maximascanciones = 10; //Estas serán las máximas canciones mostradas por página.
        //mapeamos todas las canciones y las introducimos en el array listaqueue
        for (let i = 0; i < queue.songs.length; i += maximascanciones) {
            let canciones = queue.songs.slice(i, i + maximascanciones);
            listaqueue.push(canciones.map((cancion, index) => `**\`${i + ++index}\`** - [${cancion.name}](${cancion.url})`).join("\n "));
        }

        var limite = listaqueue.length;
        var embeds = [];
        //Hacemos un loop entre todas las canciones hasta el límite
        for (let i = 0; i < limite; i++) {
            let desc = String(listaqueue[i]).substring(0, 2048); //Nos aseguramos de que la longitud del mensaje sea menor que 2048, para evitar errores.
            //Creamos un embed por cada 10 canciones
            let embed = new Discord.MessageEmbed()
                .setTitle(eval(client.la[idioma]["comandos"]["musica"]["queue"]["titulo"]))
                .setColor("#8400ff")
                .setDescription(desc)
            //Si la cantidad de canciones a mostrar es mayor a una, entonces especificamos en el embed, que canción se está reproduciendo en ese instante.
            if (queue.songs.length > 1) embed.addField(client.la[idioma]["comandos"]["musica"]["queue"]["cancionAcField"],eval(client.la[idioma]["comandos"]["musica"]["queue"]["cancionAcFieldr"]))
            await embeds.push(embed)
        }
        return paginacion();

        //definimos la funcion de paginación
        async function paginacion() {
            let paginaActual = 0;
            //Si la cantidad de embeds es solo 1, envíamos el mensaje tal cual sin botones
            if (embeds.length === 1) return message.channel.send({ embeds: [embeds[0]] }).catch(() => { });
            //Si el numero de embeds es mayor 1, hacemos el resto || definimos los botones.
            let boton_atras = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('Atrás').setEmoji('◀').setLabel('Atrás')
            let boton_inicio = new Discord.MessageButton().setStyle('SECONDARY').setCustomId('Inicio').setEmoji('🔳').setLabel('Inicio')
            let boton_avanzar = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('Avanzar').setEmoji('▶').setLabel('Avanzar')
            //Enviamos el mensaje embed con los botones
            let embedpaginas = await message.channel.send({
                content: client.la[idioma]["comandos"]["musica"]["queue"]["botones"],
                embeds: [embeds[0].setFooter({ text: `Página ${paginaActual + 1} / ${embeds.length}`,iconURL: `${client.user.displayAvatarURL()}` })],
                components: [new Discord.MessageActionRow().addComponents([boton_atras, boton_inicio, boton_avanzar])]
            });
            //Creamos un collector y filtramos que la persona que haga click al botón, sea la misma que ha puesto el comando, y que el autor del mensaje de las páginas, sea el cliente
            const collector = embedpaginas.createMessageComponentCollector({ filter: i => i?.isButton() && i?.user && i?.message.author.id == client.user.id, time: 180e3 });
            //Escuchamos los eventos del collector
            collector.on("collect", async b => {
                switch (b?.customId) {
                    case "Atrás": {
                        //Resetemamos el tiempo del collector
                        collector.resetTimer();
                        //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                        if (paginaActual !== 0) {
                            //Resetemamos el valor de pagina actual -1
                            paginaActual -= 1
                            //Editamos el embeds
                            await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Página ${paginaActual + 1} / ${embeds.length}`,iconURL: `${client.user.displayAvatarURL()}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        } else {
                            //Reseteamos al cantidad de embeds - 1
                            paginaActual = embeds.length - 1
                            //Editamos el embeds
                            await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Página ${paginaActual + 1} / ${embeds.length}`,iconURL: `${client.user.displayAvatarURL()}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        }
                    }
                        break;

                    case "Inicio": {
                        //Resetemamos el tiempo del collector
                        collector.resetTimer();
                        //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                        paginaActual = 0;
                        await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Página ${paginaActual + 1} / ${embeds.length}`,iconURL: `${client.user.displayAvatarURL()}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                        await b?.deferUpdate();
                    }
                        break;

                    case "Avanzar": {
                        //Resetemamos el tiempo del collector
                        collector.resetTimer();
                        //Si la pagina a avanzar no es la ultima, entonces avanzamos una página
                        if (paginaActual < embeds.length - 1) {
                            //Aumentamos el valor de pagina actual +1
                            paginaActual++
                            //Editamos el embeds
                            await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Página ${paginaActual + 1} / ${embeds.length}`,iconURL: `${client.user.displayAvatarURL()}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        //En caso de que sea la ultima, volvemos a la primera
                        } else {
                            //Reseteamos al cantidad de embeds - 1
                            paginaActual = 0
                            //Editamos el embeds
                            await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Página ${paginaActual + 1} / ${embeds.length}`,iconURL: `${client.user.displayAvatarURL()}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        }
                    }
                        break;

                    default:
                        break;
                }
            });
            collector.on("end", () => {
                //desactivamos los botones y editamos el mensaje
                embedpaginas.components[0].components.map(boton => boton.disabled = true)
                embedpaginas.edit({content: eval(client.la[idioma]["comandos"]["musica"]["queue"]["variable5"]), embeds: [embeds[paginaActual].setFooter({ text: `Página ${paginaActual + 1} / ${embeds.length}`,iconURL: `${client.user.displayAvatarURL()}` })], components: [embedpaginas.components[0]] }).catch(() => { });
            });
        }
    }
}