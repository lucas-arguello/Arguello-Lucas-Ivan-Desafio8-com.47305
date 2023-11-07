console.log("CHAT de js");

//socket del cliente
const socketClient = io();

//aca capturamos el "userName","inputMsg","sendMsg" y "chatPanel" desde el Html , para luego con el innerHTML asignarle un valor.
const userName = document.getElementById("userName");
const inputMsg = document.getElementById("inputMsg");
const sendMsg = document.getElementById("sendMsg");
const chatPanel = document.getElementById("chatPanel");

let user;
//Aca creo el "Alert" para que el usuario se resgistre o se loguee
Swal.fire({
    
    title: 'chat',
    text: 'Por favor ingresa tu nombre de usuario',
    input: 'text',
    inputValidator: (value) =>{       //evita salir del "alert" si no se coloca un nombre de usuario.
        return !value && 'debes ingresar nombre de usuario'
    },
    allowOutsideClick: false,        //evita salir del "alert", si se hace "click" fuera de el.
    allowEscapeKey: false            //evita salir del "alert", si se aprieta la tecla "escape".

}).then((inputValue ) => {
    console.log(inputValue);
    user= inputValue.value;
    userName.innerHTML = user     //aca corgo el nombre del usuario, que se asigna en el HTML 

});

//Aca le damos una funcion al "boton enviar" para que envie y muestre el mensaje y que usuario lo envio.
sendMsg.addEventListener("click", (e)=>{
    e.preventDefault();
    console.log('enviando mensaje.....', {user: user, message: inputMsg.value});
    const msg = {user:user, message: inputMsg.value};
    socketClient.emit("msgChat", msg)      //Aca enviamos el mensaje del "Socket cliente" al socket del Servidor.
    
     //para solucionar que no llegue vacio
     inputMsg.value = '';
     
    
});

//Para que cada cliente o usuario reciba cada mensaje del chat, que emitan los demas usuarios.
socketClient.on("chatHistory", (dataServer) => {
    console.log(dataServer);
    
    let msgElements= "";

    dataServer.forEach(elem => { 
        msgElements += 
        
        ` <p> Usuario: ${elem.user} >>>>> Mensaje: ${elem.message} </P>`

        chatPanel.innerHTML = msgElements;
        
    });
});

