import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

//Aqui creo la coleccion "products" en la Base de Datos.
const productsCollection = "products" 

//Aqui creo el esquema o modelo del producto, determinando las propiedades que quiero que se guarde en la Base de datos.
const productSchema = new mongoose.Schema({

    title: {
        required: true,
        type: String
     }
    ,
	description: {
            required: true,
            type: String
        } ,
	price: {
            required: true,
            type: Number
        },
	thumbnail: {
        
        type: String
    },
	code: {
        required: true,
        type: String
    },
	stock:{
            required: true,
            type: Number
        },
	status: {
        
        type: String
    },
	category: {
        required: true,
        type: String
    }

});

productSchema.plugin(mongoosePaginate);
//exportamos el modelo de producto y la coleccion.
export const productsModel = mongoose.model(productsCollection,productSchema);  