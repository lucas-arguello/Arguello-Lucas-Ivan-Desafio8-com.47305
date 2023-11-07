
import {Router} from "express";//importamos "routes" desde la libreria de express, para poder realizar el ruteo de los metodos.

import { cartsServiceMongo } from "../dao/index.js"



const router = Router();

//Usamos el metodo GET para crear una ruta que nos permita obtener el listado de todos los carritos.
router.get("/", async (req, res) => {
    try {
      const carts = await cartsServiceMongo.getCarts();
  
      res.json({ message: "Listado de carritos", data: carts });

    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

//Usamos el metodo GET para crear una ruta que nos permita obtener un solo carrito.

router.get("/:cid", async (req, res) => {
    try {
      
      const cartId = req.params.cid; //obtengo el id del carrito ingresado por el cliente en la URL.
      const carts = await cartsServiceMongo.getCartsId(cartId); //traigo todos los carritos con el metodo "getCartsId" del "cartService".
      
      if(carts){
        res.json({ message: "Carrito encontrado", data: carts }); //la respuesta a la solicitud del cliente.
      }else{
        res.json({ status: "error", message: "Carrito no encontrado"});
      } 
    
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

//Usamos el metodo POST para crear una ruta que nos permita crear un carrito.
router.post("/", async (req, res) => {
    try {
      
      const newCart = await cartsServiceMongo.createCart();//traigo el metodo "createCart" del "cartService", para poder crear un carrito.
      res.json({ message: "Carrito creado", data: newCart });//la respuesta a la solicitud del cliente.
    
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

//Usamos el metodo PUT para actualizar, obtenemos el carrito por su ID, y podemos completo.-- agregar prod o cambiar cant o cambiar el di porque que quiero poner otro prod
router.put("/:cid", async (req, res) => {
      try {
        const {cid: cardId } = req.params; //obtengo el id del carrito
        const newProduct = req.body;//obtengo el producto
        const updatedCart = await cartsServiceMongo.updateCartId(cardId, newProduct);// le paso el id y el cuerpo 
        res.json({ message: "Carrito actualizado con exito", data: updatedCart });
      }
      catch (error) {
        res.json({ status: "error",  message: error.message });
      }
})

//Usamos el metodo PUT para crear una ruta que nos permita buscar un carrito y agregar productos en el carrito.-- solo agrega prod
router.put("/:cid/product/:pid", async (req, res) => {
    try {

      //obtengo el id del carrito y el id del producto ingresado por el cliente en la URL.
      const cartsId = req.params.cid;
      const productId = req.params.pid;

      const quantity = 1;
      
      const cart = await cartsServiceMongo.addProduct(cartsId, productId, quantity);//Y con los ID de carrito y de producto, buscamos el carrito y le agregamos los productos segun su id.
      res.json({ message: "Producto agregado al carrito", data: cart });//la respuesta a la solicitud del cliente.
    
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
});

//Usamos el metodo PUT para que actualice el produto del carrito por su ID.-- solo actualizamos la cantidad.
router.put("/:cid/products/:pid", async (req, res) => {
    try {
      const { cid: id, pid: productId } = req.params;
      const newQuantity  = req.body.newQuantity;
      const updatedCart = await cartsServiceMongo.updateProductInCart(id, productId, newQuantity);
      res.json({ message: "success", data: updatedCart });
    }
    catch (error) {
      res.json({ status: "error",  message: error.message });
    }
})
 //Usamos el metodo DELETE para eliminar un carrito por su ID.
router.delete("/:cid", async (req, res) => {
    try {
      const { cid: cartId } = req.params;//encuentro el id
      const cartDeleted = await cartsServiceMongo.deleteCartId(cartId);
      res.json({ message: "Carrito con id ' " + cartId + " ' eliminado con exito", data: cartDeleted });
      
    }
    catch (error) {
      res.json({ status: "error",  message: error.message });
    }
})


//Usamos el metodo DELETE para eliminar un producto específico de un carrito por su ID de carrito y producto
router.delete("/:cid/products/:pid", async (req, res) => {
    try {

        const { cid: idCarts, pid: productId } = req.params;
        const deletedProduct = await cartsServiceMongo.deleteProductInCart(idCarts, productId);
        res.json({ message: "Producto eliminado del carrito", data: deletedProduct }); 
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});


export {router as cartsRouter};




//RUTAS

//get- para obtener todos los carritos --> //http://localhost:8080/api/carts

//get- para obtener un carrito por su ID --> //http://localhost:8080/api/carts/cid

//post- para crear carritos --> //http://localhost:8080/api/carts

//put- para un carrito por su id --> //http://localhost:8080/api/carts/:cid

//put- para agregar productos y actualizar carrito--> http://localhost:8080/api/carts/:cid/products/:pid

//delete- para borrar carritos --> //http://localhost:8080/api/carts/:cid

//delete- para borrar productos especifico  --> // http://localhost:8080/api/carts/:cid/products/:pid 