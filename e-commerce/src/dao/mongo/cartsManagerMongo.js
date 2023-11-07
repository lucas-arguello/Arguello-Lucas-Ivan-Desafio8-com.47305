import { cartsModel } from "./models/cartsModel.js";


export class CartsManagerMongo{
    constructor() {
        this.model = cartsModel;
                
        };
        
        //Esta funcion es para obtener el listado de carritos.
        async getCarts () {
                try {

                    const carts = await this.model.find();

                    return carts

                }catch(error){
                    console.log("getCarts",error.message);
                    throw new Error("No se pudieron obtener el listado de carritos", error.message);

                };
        };

        //Esta funcion es para obtener un carrito por su ID.
        async getCartsId(cartId) {

                try {//el id lo traigo igual que la DB _id
                    const cart = await this.model.findById(cartId).populate("products.productId").lean();
                    return cart;
                } catch (error) {
                    console.log('getCartsId', error.message);
                    throw new Error('No se pudo obtener el carrito ', error.message);
                }
        }

        //Esta funcion es para crear el carrito.
        async createCart(){
            try {

                const newCart = {}
                const cart = await this.model.create(newCart);
                return cart

            } catch (error) {
                console.log('createCart', error.message);
                throw new Error('No se pudo crear el carrito ', error.message);
            }
    }

        //Esta funcion es para agregar productos por su ID, al carrito seleccionado por su ID.
        async addProduct(cartId, productId) {
            try {
                let quantity = 1
                const cart = await this.model.findById(cartId);
    
                if(cart){
                    const { products } = cart;
                    const productExist = products.find((prod) => prod.productId == productId);
                    if(productExist){
                        productExist.quantity += quantity;
                    }else{
                        cart.products.push({ productId: productId, quantity: quantity }); 
    
                    }
                    const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
                    return result
                }else{
                    throw new Error("No se pudo encontrar el carrito");
                }
            } catch (error) {
                console.log('addProduct', error.message);
                throw new Error('No se pudo agregar el producto ', error.message);
            }
        }

        //Esta funcion deberá actualizar el carrito con un arreglo de productos
        async updateCartId(cartId, newProduct) {
                try {
                    const cart = await this.getCartsId(cartId)
                    if(cart){
                        if(!cart || cart.length === 0){
                            throw new Error("el carrito no contiene productos");
                        }else{
                            cart.products = newProduct
        
                            const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true })
                            return result
                        }
                    }else{
                        throw new Error("No se pudo encontrar el carrito");
                    }
                    
                } catch (error) {
                    console.log('actualizar carrito completo', error.message);
                    throw new Error('No se pudo actualizar el carrito', error.message);
                }
        }
            
        //Esta funcion deberá poder actualizar SÓLO la cantidad de ejemplares del producto por 
        //cualquier cantidad pasada desde req.body
        
        async updateProductInCart(cartId, productId, newQuantity) {
            try {
                const cart = await this.getCartsId(cartId)
                if(cart){
                
                    const productIndex =  cart.products.findIndex((prod) => prod.productId._id == productId)
                              
                    if(productIndex >= 0){
                        cart.products[productIndex].quantity = newQuantity
                        const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true })
                        return result
                    }else{
                        throw new Error("No se pudo encontrar el producto");
                    }
                }else{
                    throw new Error("No se pudo encontrar el carrito");
                }
    
             } catch (error) {
                 console.log('updateProductInCart', error.message);
                 throw new Error('No se pudo actualizar el carrito ', error.message);
             }
        }
        

        //Esta funcion es para eliminar un carrito por su ID.
        async deleteCartId(cartId) {
                try {
                    const cart = await this.getCartsId(cartId);
                    if (!cart) {
                        throw new Error("No se pudo encontrar el carrito a eliminar");
                    }else{
                        await this.model.findByIdAndDelete(cartId)
                    }
                    const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
                    return result;
                } catch (error) {
                    console.log('deleteCartId', error.message);
                    throw new Error('No se pudo eliminar el carrito ', error.message);
                }
        }
            
        //Esta funcion deberá eliminar del carrito el producto seleccionado.
        async deleteProductInCart(cartId, productId) {
                try {
                    const cart = await this.model.findById(cartId);
        
                    if(cart){
                        const productExist = cart.products.find((prod) => prod.productId._id == productId);
                                                                    
                        if (productExist) {
                            const newProducts = cart.products.filter((prod) => prod.productId._id != productId);
                            cart.products = newProducts
                            const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
                            return result
                        }else{
                            throw new Error("No se pudo encontrar el producto a eliminar");
                        }
                    }else{
                        throw new Error("No se pudo encontrar el carrito");
                    }
        
                } catch (error) {
                    console.log('deleteProductInCart', error.message);
                    throw new Error('No se pudo eliminar el carrito ', error.message);
                }
        }         
};

