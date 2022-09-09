const Discord = require("discord.js");
const prueba_Schema = require(`${process.cwd()}/modelos/prueba.js`);
module.exports = {
    name: "prueba",
    aliases: [],
    desc: "Sirve para probar xd",
    owner: true,
    run: async(client,message,args,prefix,idioma) =>{
        
        let data = await prueba_Schema.findOne({userID: message.author.id});
        if(!data){
            data = new prueba_Schema({
                userID: message.author.id,
            })
            await data.save();
        }
        console.log(data.array);

        if(data.array.length === 0) {//No tiene elementos
            let objeto = {
                id: "000",
                numero: 1
            }
            data.array.push(objeto);
        }else{
            await prueba_Schema.findOneAndUpdate({userID: message.author.id,'array.id': "000"},{$inc: {
                'array.$.numero': 1
            }})
        }
        data.save();
        return message.channel.send(`**¡ Numero Aumentado !**\nNumero Actual: \`${data.array[0].numero}\``);
        
    }
}