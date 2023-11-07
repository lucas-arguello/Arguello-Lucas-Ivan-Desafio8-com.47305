import fs from "fs"; // importamos el modulo js

class ProductsManager {
    //creo la variable path, para luego colocar en ella la ruta del archivo "productos.json"
    constructor(path){
        this.path = path;
        this.products = [];
    };
    //Validamos si el archivo existe
    fileExist(){
        return fs.existsSync(this.path)
    }
    //se crea el metodo para crear productos
    async createProduct(productInfo) {
        try{
            
            if(this.fileExist()){
                //si el archivo existe, 1ro tenemos que leer el contenido del arch,
                const contenido = await fs.promises.readFile(this.path, "utf-8");
                //2do. Transformar de tipo "string" a JSON
                const contenidoJson = JSON.parse(contenido);

                // Verificar si ya existe un producto con el mismo código
                const existingProduct = contenidoJson.find(product => product.code === productInfo.code);

                if (existingProduct) {
                    console.log("Error: Ya existe un producto con el mismo código.");
                    return; // No se agrega el producto si ya existe un código igual.
                }

                //ahora para obtener el ultimo id
                const lastId = contenidoJson.length > 0 ? contenidoJson[contenidoJson.length - 1].id : 0;
                const newProduct = { id: lastId + 1, ...productInfo };
                //3ro. agregamos la info del producto al [arreglo vacio] de "productos.json"
                contenidoJson.push(newProduct);
                
                //4to. Sobreescribimos la informac con el nuevo producto.
                await fs.promises.writeFile(this.path,JSON.stringify(contenidoJson, null, "\t") );
                console.log("Producto agregado");
                
                return newProduct
            } else {
                throw new Error("no es posible guardar el producto");
            }

        } catch (err){
            console.log(err.message);
              //lanzamos el error para poder manejarlo como un error y no como un string.
            throw err;
        }

    }

    //Este método se encarga de obtener la lista completa de todos los productos ,
    //presentes en el archivo "productos.json" 
    async getProducts() {
        try{
            if(this.fileExist()){
                //si el archivo existe, 1ro tenemos que leer el contenido del arch
                const contenido = await fs.promises.readFile(this.path, "utf-8");
                //2do. Transformar de tipo "string" a JSON
                return JSON.parse(contenido);               

            } 
        } catch (err) {
            console.log(err.message);
            }
        return [];
        }

    //Este metodo se encarga de buscar en el archivo "productos.json" el producto que coincida con el id.
    async getProductById(id) {
        try {
            if (this.fileExist()) {
                const contenidoString = await fs.promises.readFile(this.path, "utf-8");
                const contenidoJson = JSON.parse(contenidoString);
                const productId = parseInt(id);
                const product = contenidoJson.find(product => product.id === productId);

                if(!product){
                    throw new Error("El producto no existe");
                }
                return product
            }
        } catch (err) {
            console.log(err.message);
        }
        return null;
    }
    //Este metodo recibe el id del producto a actualizar, así también como el campo a actualizar.
    async updateProduct(id, updatedFields) {
        try {
            if (this.fileExist()) {
                const contenido = await fs.promises.readFile(this.path, "utf-8");
                const contenidoJson = JSON.parse(contenido);

                const index = contenidoJson.findIndex(product => product.id === id);
                if (index !== -1) {
                    contenidoJson[index] = { ...contenidoJson[index], ...updatedFields };
                    await fs.promises.writeFile(this.path, JSON.stringify(contenidoJson, null, "\t"));
                    console.log("Producto actualizado");
                }
            }
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    }
    //Este metodo recibe un id y debe eliminar el producto que tenga ese id en el archivo.
    async deleteProduct(id) {
        try {
            if (this.fileExist()) {
                const contenido = await fs.promises.readFile(this.path, "utf-8");
                const contenidoJson = JSON.parse(contenido);

                const filteredProducts = contenidoJson.filter(product => product.id !== id);
                await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, "\t"));
                console.log("Producto eliminado");
            }
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    }
}

        

const operations = async () => {
    try {
        const product = new ProductsManager("products.json");
        await product.createProduct({
            title: "Estanteria",
            description: "muebles de madera de pino",
            price: 100,
            thumbnail: "sin imagen",
            code: "abc123",
            stock: 25
        });
        await product.createProduct({
            title: "Ropero",
            description: "muebles de madera de pino",
            price: 1500,
            thumbnail: "sin imagen",
            code: "def456",
            stock: 10
        });
        
        await product.createProduct({
            title: "Comoda",
                description: "muebles de madera de Roble",
                price: 2000,
                thumbnail: "sin imagen",
                code: "dei432",
                stock: 5
        });

        await product.createProduct({
            title: "Somier 2 plazas",
            description: "muebles de madera de Algarrobo",
            price: 15000,
            thumbnail: "sin imagen",
            code: "for747",
            stock: 7
        });

        await product.createProduct({
            title: "Cucheta",
                description: "muebles de madera de pino",
                price: 11000,
                thumbnail: "sin imagen",
                code: "lac936",
                stock: 10
        });

        await product.createProduct({
            title: "Cucheta",
                description: "muebles de madera de pino",
                price: 11000,
                thumbnail: "sin imagen",
                code: "lac936",
                stock: 10
        });

        const productsList = await product.getProducts();
        console.log(productsList);

        const productById = await product.getProductById(1);
        console.log(productById);

        await product.updateProduct(1, { price: 120 });

        // await product.deleteProduct(1);
    } catch (err) {
        console.log(err.message);
    }
};

// operations();

export {ProductsManager};