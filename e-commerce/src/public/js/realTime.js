//este archivo maneja el "js" del lado de "Frontend" de la vista "realtime" 

//Ahora creamos el "socket" del lado del cliente
const socketClient = io();

//Obtenemos los elementos a manipular en el HTML por medio de su "id".
const productList = document.getElementById("productList")
const createProductForm = document.getElementById("createProductForm")

//1ro. a los elementos del form, le agregamos el evento "submit",
//y capturamos la info del form. en una funcion, para poder enviar la info al servidor.
createProductForm.addEventListener("submit",(e)=>{
    
    e.preventDefault();
    //console.log(e);
    //en esta variable capturamos todos los campos del formulario.
    const formData = new FormData(createProductForm);
    // console.log(formData.get("title"))
    //creamos el objeto JSON que vamos enviar con la Data, e iteramos con un (for- of) un arreglo, para crear un objeto
    const jsonData = {};
    for(const [key,value] of formData.entries()){
        jsonData[key]=value
    }; 
    jsonData.stock = parseInt(jsonData.stock);
    jsonData.price = parseInt(jsonData.price);
    
    console.log("Un producto fue creado: ",jsonData);

    //ahora enviamos la info del formulario (jsonData) al socket del servidor
    socketClient.emit("addProduct", jsonData);
    //con el metodo "reset" hacemos vacios los campos una vez enviado el producto.
    createProductForm.reset();
});




//recibimos los productos desde el server de websocket.

socketClient.on("productsArray", (dataProdcuts) => {
        //console.log(dataProdcuts);
        let productsElems= "";
        //Iteramos en el array de productos creamos una lista.
        dataProdcuts.forEach(prod =>{ 
            productsElems+= 
            ` <li>
                    <p>Nombre : ${prod.title}</p>
                    <p>Descripcion: ${prod.description}</p>
                    <p>Precio: ${prod.price}</p>
                    <p>Codigo: ${prod.code}</p>
                    <p>imagen: ${prod.thumbnail}</p>
                    <p>Stock: ${prod.stock}</p>
                    <p>Categoria: ${prod.category}</p> 
                    <button class="deleteProduct" data-id="${prod._id}">Eliminar</button>
            </li> `;
            // console.log(productsElems);
            
            });
            //inserto la lista de productos en el HTML de "realtime.hbs"      
            productList.innerHTML= productsElems;
        });


//enviamos la info del form al socket del servidor para eliminar un producto
document.addEventListener('click', function (e) {
    if (e.target) {
        if (e.target.classList.contains('deleteProduct')) {
            // Obtener el ID del producto como una cadena
            const prodId = e.target.dataset.id.toString();
            console.log("ID del producto eliminado: ", prodId);           
              // Envía el ID al servidor para ser eliminado
              socketClient.emit('deleteProduct', prodId);
           
        }
    }
    //verifico que en el click reciba la clase deleteProduct
    if (e.target) {
        if (e.target.classList.contains('deleteProduct')) {
            //obtengo el id del producto
            const prodId = (e.target.dataset.id);
            //envio el id al socket para ser eliminado
            socketClient.emit('deleteProduct', prodId);
        }
    }
});

//


