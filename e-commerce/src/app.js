import express from "express" // importamos el modulo "express" para poder usar sus metodos.
import session from "express-session";
import MongoStore from "connect-mongo";
import { __dirname } from "./utils.js";//importamos la variable "__dirname" que va servir como punto de acceso a los arch. desde "src"
import path from "path";
//import { productsService } from "./dao/index.js"; 
import { productsServiceMongo } from "./dao/index.js"; 
import { chatsServiceMongo } from "./dao/index.js";

import {engine} from "express-handlebars";
import {Server} from "socket.io";
import { config } from './config/config.js';

import { connectDB } from "./config/dbConection.js";

/*---------- aplico jwt ------------------  */
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { initializePassport } from './config/passport.config.js';



//importo rutas http y las de handlebars
import { viewsRouter } from "./routes/views.routes.js";//importamos las rutas de las vistas.
import { productsRouter } from "./routes/products.routes.js";// importamos la ruta "products"
import { cartsRouter } from "./routes/carts.routes.js";// importamos la ruta "carts"
import { usersSessionsRouter } from "./routes/usersSessions.routes.js";//importamos la ruta de "users"


const port = 8080; //creamos el puerto de acceso, donde se va ejecutar el servidor.

const app = express(); //creamos el servidor. Aca tenemos todas las funcionalidades que nos ofrece el modulo "express".

//middleware para hacer accesible la carpeta "public" para todo el proyecto.
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());


//configuramos websockets del lado del servidor (backend), vinculando el servidor http con el servidor de websocket.
//servidor de http
const httpServer = app.listen(port, () => console.log(`Servidor OK, puerto: ${port}`)); //con el metodo "listen" escuchamos ese punto de acceso "8080"

//conexxion a la Base de Datos
connectDB();

//servidor de websocket
const io = new Server(httpServer)

//configuracion de Handlebars
app.engine('hbs', engine({extname:'.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,'/views') ); 

//configuracion de passport
initializePassport()//se crean las estrategias
app.use(passport.initialize())//inicializo passport dentro del servidor

//vinculamos las rutas con nuestro servidor con el metodo "use". Son "Middlewares", son funciones intermadiarias.
app.use(viewsRouter); //contiene rutas de tipo GET, porque son las que van a utilizar los usuarios en el navegador.
app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter);
app.use("/api/sessions", usersSessionsRouter);

//

//socket server- enviamos del servidor al cliente los productos creados hasta el momentopermitimos una actualizacion 
//automatica de los productos creados. Y tambien importamos "productService" para disponer de los productos.
io.on("connection", async (socket)=> {
    console.log("cliente conectado")

    try{
        //Obtengo los productos 
        const products = await productsServiceMongo.getProducts();
        //y los envio al cliente
        socket.emit("productsArray", products)

        } catch (error) {
            console.log('Error al obtener los productos', error.message);
            
        }
    

    //Recibimos los productos desde el socketClient de "realTime.js".
    socket.on("addProduct",async (productData) =>{
        try{    
            //creamos los productos
            const createProduct = await productsServiceMongo.createProduct(productData);

            console.log(createProduct);
            //obtenemos los productos
            const products = await productsServiceMongo.getProducts();
            //mostramos los productos
            io.emit("productsArray", products)

            } catch (error) {
                    console.error('Error al crear un producto:', error.message);
            }    
        });

    //Eliminamos los produtos.

    socket.on("deleteProduct", async (productId) => {
        try {
            // Eliminar el producto de la lista de productos por su ID
            await productsServiceMongo.deleteProduct(productId);
            // Obtener la lista actualizada de productos
            const updatedProducts = await productsServiceMongo.getProducts();
            // Emitir la lista actualizada de productos al cliente
            socket.emit('productsArray', updatedProducts);
            } catch (error) {
                // Manejar errores, por ejemplo, si el producto no se encuentra
                console.error('Error al eliminar un producto:', error.message);
            }
        });

//Recibimos los mensajes desde el socketClient de "chats.js".
     
    //traigo todos los chat
    const msg = await chatsServiceMongo.getMessage()
    //emito los caht 
    socket.emit("chatHistory", msg)
    //recibo mensaje de cada usuario desde el cliente
    socket.on('msgChat', async (messageClient) => {//recibo el mensaje del front
        try {
            //creo los chat en la base de datos
            await chatsServiceMongo.addMessage(messageClient);
            //obtengo y actualizo los mensajes
            const msg = await chatsServiceMongo.getMessage();
            //replico y envio el mensaje a todos los usuarios
            io.emit('chatHistory', msg);//envio el mensaje
            
        } catch (error) {
            console.error('Error al enviar el mensaje:', error.message);
        }

    })
    

});



