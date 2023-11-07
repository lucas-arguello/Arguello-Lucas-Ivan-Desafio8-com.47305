import mongoose from "mongoose";
import { config } from "./config.js";

//Creamos la conexion con nuestra Base de Datos y luego la exportamos.
export const connectDB = async () => {
    try{

        //remplazo url de db por la variable de entorno
        const url = config.mongo.url
        
        await mongoose.connect(url);

        console.log("Base de Datos conectada, OK")

    }catch (error) {
        console.log(`Hubo un error al conectar la base de datos ${error.message}`);
    }
}