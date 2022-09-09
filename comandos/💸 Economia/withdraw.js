const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
module.exports = {
    name: "withdraw",
    aliases: ["wd","sacar", "retirar"],
    desc: "Sirve para retirar dinero en el banco",
    permisos: ["VIEW_CHANNEL","SEND_MESSAGES"],
    permisos_bot: ["VIEW_CHANNEL","SEND_MESSAGES"],
    run: async(client,message,args,prefix,idioma) =>{
        //aseguramos la economia del usuario
        await asegurar_todo(null,message.author.id);
        //leemos la economia del usuario
        let data = await ecoSchema.findOne({userID: message.author.id});
        let cantidad = args[0];
        //comprobaciones previas
        if(data.banco == 0) return message.reply(client.la[idioma]["comandos"]["economia"]["withdraw"]["variable1"])
        if(["todo","all-in","all"].includes(args[0])){
            cantidad = data.banco;
        }else{
            if(isNaN(cantidad) || cantidad <= 0 || cantidad %1!=0) return message.reply(client.la[idioma]["comandos"]["economia"]["withdraw"]["variable2"])
            if(cantidad > data.banco) return message.reply(client.la[idioma]["comandos"]["economia"]["withdraw"]["variable3"]);
        }
        await ecoSchema.findOneAndUpdate({userID: message.author.id}, {
            $inc:{
                banco: -cantidad,
                dinero: cantidad,
            }
        });
        return message.reply(eval(client.la[idioma]["comandos"]["economia"]["withdraw"]["variable4"]));
    }
}