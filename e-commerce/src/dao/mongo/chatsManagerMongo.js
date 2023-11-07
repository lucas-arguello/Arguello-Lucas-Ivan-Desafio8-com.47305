import { chatsModel } from "./models/chatsModel.js";


export class ChatsManagerMongo{
                constructor(){
                    this.model = chatsModel;
                };

                async addMessage(messageInfo){
                    try {

                        const message = await this.model.create(messageInfo);

                        return message

                    }catch(error){
                        console.log("addMessage", error.message);
                        throw new Error ("No se pudo agregar el mensaje");
                    };
                };

                async getMessage() {
                    try {
                        const messagesList = await this.model.find();
                       
                        return messagesList
                    }catch (error){
                        console.log("getMessage", error.message);
                        throw new Error ("No se pudo conseguir el listado de mensajes")
                    };
                };
}