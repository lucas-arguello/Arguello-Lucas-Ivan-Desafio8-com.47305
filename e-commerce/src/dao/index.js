//Aca importamos los Managers para crear nuestros servicios, instanciando a cada modulo y le pasamos el "path",
//y los exportamos para poder utilizarlos otras partes del codigo.

//import { ProductsManager } from "./files/productsManager.js";
//import { CratsManager } from "./files/cartsManager.js";

import { __dirname } from "../utils.js"; //importamos la variable "__dirname" para tener disponible un punto de referencia de nuestros archivos.
import path from "path"; //instalamos esta libreria de Nodejs que ya viene integrada. Me ayuda a unir diferentes rutas.

import { ProductsManagerMongo } from "./mongo/productsManagerMongo.js";
import { ChatsManagerMongo } from "./mongo/chatsManagerMongo.js";
import { CartsManagerMongo } from "./mongo/cartsManagerMongo.js";
import { UsersManagerMongo } from "./mongo/usersManagerMongo.js";

//export const productsService = new ProductsManager(path.join(__dirname,"/data/products.json"));
//export const cartsService = new CratsManager(path.join(__dirname,"/data/carts.json"));

export const productsServiceMongo = new ProductsManagerMongo();
export const chatsServiceMongo = new ChatsManagerMongo()
export const cartsServiceMongo = new CartsManagerMongo();
export const usersServiceMongo = new UsersManagerMongo();