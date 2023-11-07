import mongoose from "mongoose";

//Aqui creo la coleccion "carts" en la Base de Datos.
const cartsCollection = "carts" 

//Aqui creo el esquema o modelo del carrito que quiero que se guarde en la Base de datos.
const cartSchema = new mongoose.Schema({
    products: {
            type: [
                {
                    productId:{  //a esta propiedad le aplique el metodo Populacion
                              type: mongoose.Schema.Types.ObjectId,
                              ref: "products"
                            },

                    quantity: {
                        type: Number,
                        required:true
                            }
                }
            ] ,
            //se coloco esta propiedad Default, porque al momento de crear el carrito, no voy a tener los productos.
            default:[]
    }
    
});

//exportamos el modelo de carrito y la coleccion.
export const cartsModel = mongoose.model(cartsCollection,cartSchema);