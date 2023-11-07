import mongoose from "mongoose";

//Aqui creo la coleccion "chatts" en la Base de Datos.
const chatsCollection = "chats" 

const chatSchema = new mongoose.Schema({

    user: {
        type:String,
        required: true
    },

    message: {
        type:String,
        required: true
    }
    
 });

 export const chatsModel = mongoose.model(chatsCollection, chatSchema);